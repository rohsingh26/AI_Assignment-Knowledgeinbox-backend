import axios from "axios";

export const generateEmbedding = async (text) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/embed", { text });
    return response.data.embedding;
  } catch (err) {
    console.error("Embedding generation error:", err.message);
    throw new Error("Failed to generate embedding");
  }
};
