// In-memory vector store
const vectorStore = [];

export const addVector = (chunkId, embedding) => {
  vectorStore.push({ chunkId, embedding });
};

export const removeVectorsByChunkIds = (chunkIds) => {
  for (const id of chunkIds) {
    vectorStore = vectorStore.filter(v => v.chunkId !== id);
  }
};

export const getAllVectors = () => vectorStore;

export default vectorStore;
