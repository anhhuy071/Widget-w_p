import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../api/weather";

const createResponse = () => {
  const headers: Record<string, string> = {};
  return {
    statusCode: 200,
    setHeader: vi.fn((name: string, value: string) => {
      headers[name] = value;
    }),
    end: vi.fn(),
    headers,
  };
};

describe("weather api handler", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns 400 when city is missing", async () => {
    const res = createResponse();
    await handler({ query: {} }, res);

    expect(res.statusCode).toBe(400);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "City parameter is required", code: "CITY_REQUIRED" }),
    );
  });

  it("returns 500 when API key is missing", async () => {
    const res = createResponse();
    await handler({ query: { city: "Hanoi,VN" } }, res);

    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "Weather API key is not configured on the server",
        code: "API_KEY_MISSING",
      }),
    );
  });

  it("returns 404 when geocode finds no city", async () => {
    vi.stubEnv("WEATHER_API_KEY", "test-key");
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

    const res = createResponse();
    await handler({ query: { city: "Unknown,VN" } }, res);

    expect(res.statusCode).toBe(404);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "City not found", code: "CITY_NOT_FOUND" }),
    );
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

    const res = createResponse();
    await handler({ query: { city: "Hanoi,VN" } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "s-maxage=600, stale-while-revalidate=3600",
    );
  });

  it("returns geocode failure when upstream rejects city lookup", async () => {
    vi.stubEnv("WEATHER_API_KEY", "test-key");
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({}),
    } as Response);

    const res = createResponse();
    await handler({ query: { city: "Hanoi,VN" } }, res);

    expect(res.statusCode).toBe(502);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Unable to geocode city", code: "GEOCODE_FAILED" }),
    );
  });

  it("returns upstream error when weather fetch throws", async () => {
    vi.stubEnv("WEATHER_API_KEY", "test-key");
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const res = createResponse();
    await handler({ query: { city: "Hanoi,VN" } }, res);

    expect(res.statusCode).toBe(500);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "Failed to fetch weather data from upstream",
        code: "UPSTREAM_ERROR",
      }),
    );
  });
});
