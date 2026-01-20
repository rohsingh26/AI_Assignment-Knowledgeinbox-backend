import { fetchUrlContent } from "../services/fetchUrl.service.js";
import { chunkText } from "../utils/chunkText.js";
import prisma from "../prismaClient.js";
import { addVector } from "../services/vectorStore.service.js";
import { generateEmbedding } from "../services/embedding.service.js";

export const ingestContent = async (req, res, next) => {
  try {
    const { type, content, title } = req.body;
    if (!type || !content) {
      return res.status(400).json({ error: "type and content are required" });
    }

    let finalContent = type === "url" ? await fetchUrlContent(content) : content;
    finalContent = finalContent.replace(/\s+/g, " ").trim();

    const item = await prisma.item.create({
      data: { type, title: title || null, content: finalContent },
    });

    const chunks = chunkText(finalContent, 100, 20);

    for (const chunk of chunks) {
      if (!chunk || !chunk.trim()) continue;

      const embedding = await generateEmbedding(chunk);

      const dbChunk = await prisma.chunk.create({
        data: { itemId: item.id, content: chunk, embedding },
      });

      addVector({ chunkId: dbChunk.id, embedding });
    }

    res.status(201).json({
      message: "Content ingested successfully",
      itemId: item.id,
      chunksCreated: chunks.length,
    });
  } catch (err) {
    next(err);
  }
};
