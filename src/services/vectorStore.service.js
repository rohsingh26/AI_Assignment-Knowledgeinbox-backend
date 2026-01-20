let vectorStore = [];

export const addVector = ({ chunkId, embedding }) => {
  if (!Array.isArray(embedding)) {
    console.warn(`Skipping invalid embedding for chunk ${chunkId}`);
    return;
  }
  vectorStore.push({ chunkId, embedding });
};

export const removeVectorsByChunkIds = (chunkIds) => {
  vectorStore = vectorStore.filter(v => !chunkIds.includes(v.chunkId));
};

export const clearVectorStore = () => {
  vectorStore = [];
};

export const getAllVectors = () => vectorStore;

export default vectorStore;
