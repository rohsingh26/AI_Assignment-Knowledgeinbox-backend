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
    const id = parseInt(req.params.id);

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const chunks = await prisma.chunk.findMany({ where: { itemId: id } });
    const chunkIds = chunks.map(c => c.id);

    removeVectorsByChunkIds(chunkIds);

    await prisma.item.delete({ where: { id } });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};
