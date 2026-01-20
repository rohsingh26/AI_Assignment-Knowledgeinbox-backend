export const chunkText = (text, maxWords = 100, overlap = 20) => {
  if (!text || !text.trim()) return [];

  const cleaned = text.replace(/\s+/g, " ").trim();

  const words = cleaned.split(" ");
  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + maxWords, words.length);
    const chunk = words.slice(start, end).join(" ");
    if (chunk) chunks.push(chunk);

    start += maxWords - overlap;
  }

  return chunks;
};
