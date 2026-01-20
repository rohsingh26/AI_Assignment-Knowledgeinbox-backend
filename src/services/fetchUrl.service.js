import axios from "axios";
import { JSDOM } from "jsdom";

export const fetchUrlContent = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9",
      },
      maxRedirects: 5,
      timeout: 10000,
    });

    const dom = new JSDOM(response.data);
    const doc = dom.window.document;

    let text = Array.from(doc.querySelectorAll("p"))
      .map(p => p.textContent)
      .join(" ");

    text = text.replace(/\[\d+\]/g, "");

    text = text.replace(/\s+/g, " ").trim();

    return text;
  } catch (err) {
    console.error("[fetchUrlContent Error]", err.message);
    throw new Error("Failed to fetch URL content");
  }
};
