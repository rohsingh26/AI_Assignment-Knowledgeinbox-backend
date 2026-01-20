import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askQuestion = async (question, context) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Answer the question based only on the given context." },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
      ],
      temperature: 0,
      max_tokens: 500,
    });

    return response.choices[0].message.content.trim() || "";
  } catch (err) {
    throw new Error("Failed to get answer from OpenAI");
  }
};
