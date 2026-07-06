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
  lastFetched: number | null;
  lastCategories: string[];
  fetchArticles: (categories?: string[], force?: boolean) => Promise<void>;
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
      lastFetched: null,
      lastCategories: [],
      fetchArticles: async (categories, force = false) => {
        // Prevent duplicate calls if already loading
        if (get().isLoading) return;

        const targetCategories = categories ? [...categories].sort() : [];
        const currentCategories = get().lastCategories || [];
        const categoriesChanged = JSON.stringify(targetCategories) !== JSON.stringify(currentCategories);
        
        const cacheDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        const lastFetchedTime = get().lastFetched;
        const cacheExpired = !lastFetchedTime || (Date.now() - lastFetchedTime > cacheDuration);

        // Skip fetch if not forced, we have cached articles, categories haven't changed, and cache hasn't expired
        if (!force && get().articles.length > 0 && !categoriesChanged && !cacheExpired) {
          return;
        }

        set({ isLoading: true, hasError: false, errorMessage: null });
        try {
          const data = await fetchNews(categories);
          set({
            articles: data,
            lastFetched: Date.now(),
            lastCategories: targetCategories,
            isLoading: false,
          });
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
      partialize: (state) => ({
        likedArticleIds: state.likedArticleIds,
        articles: state.articles,
        lastFetched: state.lastFetched,
        lastCategories: state.lastCategories,
      }),
    },
  ),
);
