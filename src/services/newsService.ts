import axios from "axios";
import type { NewsArticle } from "../types/news";

export const fetchNews = async (categories?: string[]): Promise<NewsArticle[]> => {
  try {
    const params = categories && categories.length > 0 ? { categories: categories.join(",") } : {};
    const res = await axios.get<NewsArticle[]>("/api/news", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw new Error("Unable to fetch news feed. Please try again later.");
  }
};
