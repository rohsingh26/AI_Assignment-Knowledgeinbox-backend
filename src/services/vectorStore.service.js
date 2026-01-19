// In-memory vector store
const vectorStore = [];

export const addVector = (chunkId, embedding) => {
  vectorStore.push({ chunkId, embedding });
};

export const removeVectorsByChunkIds = (chunkIds) => {
  for (const id of chunkIds) {
    const index = vectorStore.findIndex((v) => v.chunkId === id);
    if (index !== -1) {
      vectorStore.splice(index, 1);
    }
  }
};

export const getAllVectors = () => vectorStore;

export default vectorStore;
