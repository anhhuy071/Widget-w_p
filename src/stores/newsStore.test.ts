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
    });
  });

  it("starts in initial state", () => {
    const state = useNewsStore.getState();
    expect(state.articles).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.likedArticleIds).toEqual([]);
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
});
