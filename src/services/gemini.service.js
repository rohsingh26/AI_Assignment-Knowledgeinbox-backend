import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash"; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

export const generateAnswerFromGemini = async (question, contexts) => {
  const contextText = contexts.join("\n\n").substring(0, 5000);

  const promptText = `
You are a question-answering assistant.
Answer the question STRICTLY using the provided context.
- Do NOT add external knowledge
- Answer in ONE concise paragraph (Max 100 words)
- If the answer is not found in the context, say: "I don't know based on the given information."

Context:
"""
${contextText}
"""

Question:
"${question}"
`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500
        }
      },
      { timeout: 15000 }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "I don't know based on the given information.";

  } catch (error) {
    const errorData = error?.response?.data?.error;
    const errorMsg = errorData?.message || error.message;
    
    console.error("[Gemini API Error Details]:", errorMsg);

    if (errorMsg.includes("quota exceeded") || error.response?.status === 429) {
      const waitTimeMatch = errorMsg.match(/retry in ([\d.]+)s/);
      const seconds = waitTimeMatch ? Math.ceil(parseFloat(waitTimeMatch[1])) : "a few";

      const quotaError = new Error(`Free version limited API calls. Please try after ${seconds} seconds.`);
      quotaError.isQuotaExceeded = true;
      quotaError.retryAfter = seconds;
      throw quotaError;
    }

    throw error;
  }
};