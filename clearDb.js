import prisma from "./src/prismaClient.js";
import { clearVectorStore } from "./src/services/vectorStore.service.js";

clearVectorStore();
console.log("✅ Vector store cleared!");

const clearDb = async () => {
  await prisma.chunk.deleteMany();
  await prisma.item.deleteMany();
  console.log("✅ Database cleared!");
  await prisma.$disconnect();
};

clearDb();
