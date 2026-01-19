import { fetchUrlContent } from "../services/fetchUrl.service.js";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "../services/embedding.service.js";
import prisma from "../prismaClient.js";

export const ingestContent = async (req, res, next) => {
  try {
    const { type, content, title } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: "type and content are required" });
    }

    let finalContent = content;

    if (type === "url") {
      finalContent = await fetchUrlContent(content);
    }

    const item = await prisma.item.create({
      data: {
        type,
        title: title || null,
        content: finalContent,
      },
    });

    const chunks = chunkText(finalContent);

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);

      await prisma.chunk.create({
        data: {
          itemId: item.id,
          content: chunk,
          embedding: JSON.stringify(embedding),
        },
      });
    }

    res.status(201).json({ message: "Content ingested successfully", itemId: item.id });
  } catch (err) {
    next(err);
  }
};
