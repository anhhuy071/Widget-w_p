import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNewsStore } from "./newsStore";
import * as newsService from "../services/newsService";

vi.mock("../services/newsService", () => ({
  fetchNews: vi.fn(),
}));

describe("useNewsStore", () => {
  beforeEach(() => {
    vi.mocked(newsService.fetchNews).mockReset();
    useNewsStore.setState({
      articles: [],
      isLoading: false,
      hasError: false,
      errorMessage: null,
      likedArticleIds: [],
      lastFetched: null,
      lastCategories: [],
    });
  });

  it("starts in initial state", () => {
    const state = useNewsStore.getState();
    expect(state.articles).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.likedArticleIds).toEqual([]);
    expect(state.lastFetched).toBeNull();
    expect(state.lastCategories).toEqual([]);
  });

  it("fetches articles successfully", async () => {
    const mockArticles = [
      {
        id: "news-1",
        title: "Article 1",
        category: "thethao",
        url: "",
        source: "",
        imageUrl: "",
        publishedAt: "",
        likes: 0,
      },
    ];
    vi.mocked(newsService.fetchNews).mockResolvedValueOnce(mockArticles);

    const store = useNewsStore.getState();
    const fetchPromise = store.fetchArticles(["thethao"]);

    expect(useNewsStore.getState().isLoading).toBe(true);

    await fetchPromise;

    const state = useNewsStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.articles).toEqual(mockArticles);
    expect(state.lastCategories).toEqual(["thethao"]);
    expect(state.lastFetched).toBeGreaterThan(0);
    expect(newsService.fetchNews).toHaveBeenCalledWith(["thethao"]);
  });

  it("handles fetch failure gracefully", async () => {
    vi.mocked(newsService.fetchNews).mockRejectedValueOnce(new Error("Fetch failed"));

    await useNewsStore.getState().fetchArticles();

    const state = useNewsStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toBe("Fetch failed");
    expect(state.articles).toEqual([]);
  });

  it("toggles likes", () => {
    const store = useNewsStore.getState();
    expect(store.likedArticleIds).toEqual([]);

    store.toggleLike("news-1");
    expect(useNewsStore.getState().likedArticleIds).toEqual(["news-1"]);

    useNewsStore.getState().toggleLike("news-1");
    expect(useNewsStore.getState().likedArticleIds).toEqual([]);
  });

  it("caches news and skips fetch if conditions are met", async () => {
    const mockArticles = [{ id: "1", title: "Cached article", category: "thoisu", url: "", source: "", imageUrl: "", publishedAt: "", likes: 0 }];
    useNewsStore.setState({
      articles: mockArticles,
      lastCategories: ["thoisu"],
      lastFetched: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago (within 6h limit)
    });

    await useNewsStore.getState().fetchArticles(["thoisu"]);

    expect(newsService.fetchNews).not.toHaveBeenCalled();
  });

  it("fetches news if categories change", async () => {
    const mockArticles = [{ id: "1", title: "Cached article", category: "thoisu", url: "", source: "", imageUrl: "", publishedAt: "", likes: 0 }];
    useNewsStore.setState({
      articles: mockArticles,
      lastCategories: ["thoisu"],
      lastFetched: Date.now() - 1000 * 60 * 60 * 2,
    });
    vi.mocked(newsService.fetchNews).mockResolvedValueOnce([]);

    await useNewsStore.getState().fetchArticles(["thethao"]);

    expect(newsService.fetchNews).toHaveBeenCalledWith(["thethao"]);
  });

  it("fetches news if cache expires (>6 hours)", async () => {
    const mockArticles = [{ id: "1", title: "Cached article", category: "thoisu", url: "", source: "", imageUrl: "", publishedAt: "", likes: 0 }];
    useNewsStore.setState({
      articles: mockArticles,
      lastCategories: ["thoisu"],
      lastFetched: Date.now() - 1000 * 60 * 60 * 7, // 7 hours ago
    });
    vi.mocked(newsService.fetchNews).mockResolvedValueOnce([]);

    await useNewsStore.getState().fetchArticles(["thoisu"]);

    expect(newsService.fetchNews).toHaveBeenCalledWith(["thoisu"]);
  });

  it("fetches news if force is true", async () => {
    const mockArticles = [{ id: "1", title: "Cached article", category: "thoisu", url: "", source: "", imageUrl: "", publishedAt: "", likes: 0 }];
    useNewsStore.setState({
      articles: mockArticles,
      lastCategories: ["thoisu"],
      lastFetched: Date.now() - 1000 * 60 * 60 * 2,
    });
    vi.mocked(newsService.fetchNews).mockResolvedValueOnce([]);

    await useNewsStore.getState().fetchArticles(["thoisu"], true);

    expect(newsService.fetchNews).toHaveBeenCalledWith(["thoisu"]);
  });
});
