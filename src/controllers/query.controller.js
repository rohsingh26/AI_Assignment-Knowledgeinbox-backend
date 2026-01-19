import prisma from "../prismaClient.js";
import { cosineSimilarity } from "../utils/vectorUtils.js";
import { getAllVectors } from "../services/vectorStore.service.js";
import { askQuestion } from "../services/openai.service.js";

export const queryContent = async (req, res, next) => {
  try {
    const { question, topK = 5 } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const chunks = await prisma.chunk.findMany();
    const vectors = getAllVectors();

    // Calculate similarity
    const similarities = vectors.map((v) => {
      const chunk = chunks.find((c) => c.id === v.chunkId);
      return {
        chunkId: v.chunkId,
        content: chunk.content,
        score: cosineSimilarity(v.embedding, v.embedding) // placeholder, replace later
      };
    });

    // Get top K
    const topChunks = similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    const context = topChunks.map((c) => c.content).join("\n\n");

    const answer = await askQuestion(question, context);

    res.status(200).json({
      answer,
      sources: topChunks.map((c) => ({ id: c.chunkId, content: c.content })),
    });
  } catch (err) {
    next(err);
  }
};
