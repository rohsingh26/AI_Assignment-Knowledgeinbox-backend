import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (err) {
    throw new Error("Failed to generate embedding");
  }
};
