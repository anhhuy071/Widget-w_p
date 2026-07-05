import { describe, expect, it } from "vitest";
import { fetchMockNews, MOCK_ARTICLES } from "./newsCore";

describe("newsCore", () => {
  it("returns all articles when no categories are specified", () => {
    const articles = fetchMockNews();
    expect(articles).toEqual(MOCK_ARTICLES);
    expect(articles.length).toBe(10);
  });

  it("filters articles by single category", () => {
    const articles = fetchMockNews(["thethao"]);
    expect(articles.every((a) => a.category === "thethao")).toBe(true);
    expect(articles.length).toBe(1);
  });

  it("filters articles by multiple categories", () => {
    const articles = fetchMockNews(["thethao", "suckhoe"]);
    expect(articles.every((a) => a.category === "thethao" || a.category === "suckhoe")).toBe(true);
    expect(articles.length).toBe(3);
  });

  it("returns empty array for non-matching category", () => {
    const articles = fetchMockNews(["non-existent"]);
    expect(articles).toEqual([]);
  });
});
