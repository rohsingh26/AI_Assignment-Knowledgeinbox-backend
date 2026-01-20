import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbedding = async (text) => {
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

  if (!text || text.trim().length === 0) {
    return []; // return empty embedding for empty strings
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (err) {
    console.error("Embedding generation error:", err.response?.data || err.message);
    throw new Error("Failed to generate embedding");
  }
};
