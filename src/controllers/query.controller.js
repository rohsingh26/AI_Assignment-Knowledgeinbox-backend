import prisma from "../prismaClient.js";
import { cosineSimilarity } from "../utils/vectorUtils.js";
import { getAllVectors } from "../services/vectorStore.service.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { generateAnswerFromGemini } from "../services/gemini.service.js";

const SIMILARITY_THRESHOLD = 0.3;

export const queryContent = async (req, res, next) => {
  try {
    const { question, topK = 5 } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const vectors = getAllVectors();
    if (!vectors.length) {
      return res.status(200).json({ answer: "No content ingested yet", sources: [] });
    }

    const questionEmbedding = await generateEmbedding(question);

    const chunkIds = vectors.map(v => v.chunkId);
    const chunksInDb = await prisma.chunk.findMany({
      where: { id: { in: chunkIds } },
      select: { id: true, content: true },
    });
    const chunkMap = new Map(chunksInDb.map(c => [c.id, c]));

    const similarities = vectors
      .map(v => {
        const chunk = chunkMap.get(v.chunkId);
        if (!chunk || !Array.isArray(v.embedding)) return null;

        const score = cosineSimilarity(questionEmbedding, v.embedding);
        return score >= SIMILARITY_THRESHOLD
          ? { chunkId: v.chunkId, content: chunk.content, score }
          : null;
      })
      .filter(Boolean);

    if (!similarities.length) {
      return res.status(200).json({ 
        answer: "I don't know based on the given information.", 
        sources: [] 
      });
    }

    const topChunks = similarities.sort((a, b) => b.score - a.score).slice(0, topK);
    const contexts = topChunks.map(c => c.content);

    let finalAnswer;
    try {
      finalAnswer = await generateAnswerFromGemini(question, contexts);
    } catch (err) {
      if (err.isQuotaExceeded) {
        finalAnswer = `${err.message}\n\n[Fallback Content]: ${contexts.join(" ")}`.substring(0, 1000);
      } else {
        finalAnswer = `Notice: AI is currently busy. Here is the raw information found:\n\n${contexts.join(" ").slice(0, 500)}...`;
      }
    }

    res.status(200).json({
      answer: finalAnswer,
      sources: topChunks.map(c => ({ 
        id: c.chunkId, 
        content: c.content, 
        score: c.score 
      })),
    });
  } catch (err) {
    next(err);
  }
};
