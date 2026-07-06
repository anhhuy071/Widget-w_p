import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app";

describe("GET /api/weather", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns 400 when city is missing", async () => {
    const app = createApp();
    const response = await request(app).get("/api/weather");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "City parameter is required",
      code: "CITY_REQUIRED",
    });
  });

  it("returns 500 when API key is missing", async () => {
    const app = createApp();
    const response = await request(app).get("/api/weather").query({ city: "Hanoi,VN" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Weather API key is not configured on the server",
      code: "API_KEY_MISSING",
    });
  });

  it("returns 404 when geocode finds no city", async () => {
    vi.stubEnv("WEATHER_API_KEY", "test-key");
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const app = createApp();
    const response = await request(app).get("/api/weather").query({ city: "Unknown,VN" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "City not found", code: "CITY_NOT_FOUND" });
  });

  it("returns weather data with cache header on success", async () => {
    vi.stubEnv("WEATHER_API_KEY", "test-key");
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: 21.02, lon: 105.85 }],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 28 },
          weather: [{ main: "Clear" }],
          name: "Hanoi",
        }),
      } as Response);

    const app = createApp();
    const response = await request(app)
      .get("/api/weather")
      .query({ city: "Hanoi,VN", lang: "en" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Hanoi");
    expect(response.headers["cache-control"]).toBe(
      "s-maxage=600, stale-while-revalidate=3600",
    );
  });
});

describe("GET /api/news", () => {
  const MOCK_RSS = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Test article</title>
      <link>https://vnexpress.net/test</link>
      <pubDate>Mon, 06 Jul 2026 10:00:00 +0700</pubDate>
      <description><![CDATA[<a><img src="https://example.com/test.jpg"></a>Description text]]></description>
    </item>
  </channel>
</rss>`;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(MOCK_RSS),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns all mock articles by default", async () => {
    const app = createApp();
    const response = await request(app).get("/api/news");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5); // 1 article per category (5 categories total)
    expect(response.body[0].title).toBe("Test article");
    expect(response.body[0].imageUrl).toBe("https://example.com/test.jpg");
    expect(response.headers["cache-control"]).toBe("s-maxage=21600, stale-while-revalidate=43200");
  });

  it("filters articles by category list query", async () => {
    const app = createApp();
    const response = await request(app).get("/api/news").query({ categories: "thethao,suckhoe" });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body.every((a: { category: string }) => ["thethao", "suckhoe"].includes(a.category))).toBe(true);
  });
});
