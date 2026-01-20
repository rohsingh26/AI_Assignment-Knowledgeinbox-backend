import prisma from "../src/prismaClient.js";
import { generateEmbedding } from "../src/services/embedding.service.js";
import { addVector } from "../src/services/vectorStore.service.js";

export const backfillEmbeddings = async () => {
  console.log("🔁 Backfilling missing embeddings...");

  const chunks = await prisma.chunk.findMany();

  if (!chunks.length) {
    console.log("✅ No chunks found in DB");
    return;
  }

  for (const chunk of chunks) {
    try {
      let embedding = chunk.embedding;

      if (!Array.isArray(embedding) || embedding.length === 0) {
        console.log(`⚡ Generating embedding for chunk ${chunk.id}`);
        embedding = await generateEmbedding(chunk.content);

        await prisma.chunk.update({
          where: { id: chunk.id },
          data: { embedding },
        });
      }

      addVector({ chunkId: chunk.id, embedding });

    } catch (err) {
      console.error(`❌ Failed for chunk ${chunk.id}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log("🎉 Backfill & vector store initialization completed");
};

if (process.argv[1].includes("backfillEmbeddings.js")) {
  backfillEmbeddings().catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
}
