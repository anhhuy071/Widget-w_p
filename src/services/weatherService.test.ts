import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
    })),
    get: vi.fn(),
    isAxiosError: vi.fn((error: unknown) =>
      Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
    ),
  },
}));

describe("fetchWeatherByCity", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mocked(axios.get).mockReset();
    vi.mocked(axios.create).mockReset();
    vi.mocked(axios.create).mockReturnValue({
      get: vi.fn(),
    } as never);
    vi.mocked(axios.isAxiosError).mockImplementation((error: unknown) =>
      Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws when city is blank", async () => {
    const { fetchWeatherByCity } = await import("./weatherService");
    await expect(fetchWeatherByCity("   ")).rejects.toThrow("City is required");
  });

  it("maps 404 API errors to friendly message", async () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("PROD", true);

    vi.mocked(axios.get).mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { error: "City not found", code: "CITY_NOT_FOUND" } },
    });

    const { fetchWeatherByCity } = await import("./weatherService");
    await expect(fetchWeatherByCity("Hanoi,VN")).rejects.toThrow("City not found");
  });

  it("returns weather payload from production proxy", async () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("PROD", true);

    vi.mocked(axios.get).mockResolvedValue({
      data: {
        main: { temp: 30, feels_like: 32, humidity: 70 },
        weather: [{ main: "Clear", description: "clear sky" }],
        wind: { speed: 2 },
        name: "Hanoi",
      },
    });

    const { fetchWeatherByCity } = await import("./weatherService");
    const data = await fetchWeatherByCity("Hanoi,VN");
    expect(data.name).toBe("Hanoi");
    expect(axios.get).toHaveBeenCalledWith("/api/weather", {
      params: { city: "Hanoi,VN", lang: "en" },
    });
  });

  it("uses direct OpenWeather calls in local dev when key is present", async () => {
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_WEATHER_API_KEY", "local-key");

    const directGet = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ lat: 21, lon: 105 }] })
      .mockResolvedValueOnce({
        data: {
          main: { temp: 26, feels_like: 27, humidity: 65 },
          weather: [{ main: "Rain", description: "light rain" }],
          wind: { speed: 3 },
          name: "Hanoi",
        },
      });

    vi.mocked(axios.create).mockReturnValue({ get: directGet } as never);

    const { fetchWeatherByCity } = await import("./weatherService");
    const data = await fetchWeatherByCity("Hanoi,VN");
    expect(data.name).toBe("Hanoi");
    expect(directGet).toHaveBeenCalledTimes(2);
  });

  it("maps server and network failures to friendly messages", async () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("PROD", true);

    vi.mocked(axios.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500, data: { error: "Weather API key is not configured on the server" } },
    });
    vi.mocked(axios.get).mockRejectedValueOnce({
      isAxiosError: true,
      code: "ERR_NETWORK",
    });

    const { fetchWeatherByCity } = await import("./weatherService");
    await expect(fetchWeatherByCity("Hanoi,VN")).rejects.toThrow(
      "Weather API key is not configured on the server",
    );
    await expect(fetchWeatherByCity("Hanoi,VN")).rejects.toThrow(
      "Unable to reach the weather service. Check your connection.",
    );
  });

  it("throws when production proxy returns invalid payload", async () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("PROD", true);

    vi.mocked(axios.get).mockResolvedValue({ data: { name: "Hanoi" } });

    const { fetchWeatherByCity } = await import("./weatherService");
    await expect(fetchWeatherByCity("Hanoi,VN")).rejects.toThrow(
      "Weather service returned an unexpected response",
    );
  });
});
