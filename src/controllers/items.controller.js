import prisma from "../prismaClient.js";
import { removeVectorsByChunkIds } from "../services/vectorStore.service.js";

export const getItems = async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chunks = await prisma.chunk.findMany({ where: { itemId: parseInt(id) } });
    const chunkIds = chunks.map((c) => c.id);

    // Remove vectors from in-memory store
    removeVectorsByChunkIds(chunkIds);

    // Delete item (cascades to chunks)
    await prisma.item.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};
