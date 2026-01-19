import axios from "axios";
import { JSDOM } from "jsdom";

export const fetchUrlContent = async (url) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const text = dom.window.document.body.textContent || "";
    return text.trim();
  } catch (err) {
    throw new Error("Failed to fetch URL content");
  }
};
