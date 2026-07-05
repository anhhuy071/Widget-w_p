import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewsArticle } from "../types/news";
import { fetchNews } from "../services/newsService";

type NewsStore = {
  articles: NewsArticle[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  likedArticleIds: string[];
  fetchArticles: (categories?: string[]) => Promise<void>;
  toggleLike: (articleId: string) => void;
};

export const useNewsStore = create<NewsStore>()(
  persist(
    (set, get) => ({
      articles: [],
      isLoading: false,
      hasError: false,
      errorMessage: null,
      likedArticleIds: [],
      fetchArticles: async (categories) => {
        // Prevent duplicate calls if already loading
        if (get().isLoading) return;

        set({ isLoading: true, hasError: false, errorMessage: null });
        try {
          const data = await fetchNews(categories);
          set({ articles: data, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            hasError: true,
            errorMessage: error instanceof Error ? error.message : "Failed to load news",
          });
        }
      },
      toggleLike: (articleId) => {
        set((state) => {
          const isLiked = state.likedArticleIds.includes(articleId);
          const newLiked = isLiked
            ? state.likedArticleIds.filter((id) => id !== articleId)
            : [...state.likedArticleIds, articleId];
          return { likedArticleIds: newLiked };
        });
      },
    }),
    {
      name: "news-storage",
      partialize: (state) => ({ likedArticleIds: state.likedArticleIds }),
    },
  ),
);
