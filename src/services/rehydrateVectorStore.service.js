import prisma from "../prismaClient.js";
import { addVector, clearVectorStore } from "./vectorStore.service.js";

export const rehydrateVectorStore = async () => {
  console.log("🔁 Rehydrating vector store from DB...");

  clearVectorStore();

  const chunks = await prisma.chunk.findMany({
    where: { embedding: { not: null } },
    select: { id: true, embedding: true },
  });

  for (const chunk of chunks) {
    addVector({
      chunkId: chunk.id,
      embedding: chunk.embedding,
    });
  }

  console.log(`✅ Vector store rehydrated with ${chunks.length} chunks`);
};
