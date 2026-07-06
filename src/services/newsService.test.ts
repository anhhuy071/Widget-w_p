import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchNews } from "./newsService";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchNews", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
  });

  it("calls /api/news and returns articles", async () => {
    const mockData = [{ id: "1", title: "Test News", category: "thethao" }];
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

    const result = await fetchNews();
    expect(axios.get).toHaveBeenCalledWith("/api/news", { params: {} });
    expect(result).toEqual(mockData);
  });

  it("calls /api/news with categories query parameter", async () => {
    const mockData = [{ id: "1", title: "Test News", category: "thethao" }];
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

    const result = await fetchNews(["thethao", "thoisu"]);
    expect(axios.get).toHaveBeenCalledWith("/api/news", { params: { categories: "thethao,thoisu" } });
    expect(result).toEqual(mockData);
  });

  it("throws friendly error when API call fails", async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchNews()).rejects.toThrow("Unable to fetch news feed. Please try again later.");
  });
});
