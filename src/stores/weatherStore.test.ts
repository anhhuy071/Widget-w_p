import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWeatherFixture } from "../test/fixtures";
import useWeatherStore from "./weatherStore";
import { fetchWeatherByCity } from "../services/weatherService";

vi.mock("../services/weatherService", () => ({
  fetchWeatherByCity: vi.fn(),
}));

describe("useWeatherStore", () => {
  beforeEach(() => {
    useWeatherStore.setState({
      weather: null,
      isLoading: false,
      hasError: false,
      errorMessage: null,
      lastFetchedCity: "",
      lastFetchedAt: 0,
      pendingCity: "",
    });
    vi.mocked(fetchWeatherByCity).mockReset();
  });

  it("loads weather for a city", async () => {
    vi.mocked(fetchWeatherByCity).mockResolvedValue(createWeatherFixture({ main: { temp: 30, feels_like: 32, humidity: 70 } }));

    await useWeatherStore.getState().fetchWeatherByCity("Hanoi,VN");

    expect(useWeatherStore.getState().weather?.name).toBe("Hanoi");
    expect(useWeatherStore.getState().hasError).toBe(false);
  });

  it("stores friendly error messages", async () => {
    vi.mocked(fetchWeatherByCity).mockRejectedValue(new Error("City not found"));

    await useWeatherStore.getState().fetchWeatherByCity("Unknown,VN");

    expect(useWeatherStore.getState().hasError).toBe(true);
    expect(useWeatherStore.getState().errorMessage).toBe("City not found");
  });

  it("skips fetch when cached weather is still fresh", async () => {
    useWeatherStore.setState({
      weather: createWeatherFixture({
        main: { temp: 20, feels_like: 20, humidity: 50 },
        weather: [{ main: "Clouds", description: "cloudy", icon: "03d" }],
      }),
      lastFetchedCity: "Hanoi,VN",
      lastFetchedAt: Date.now(),
    });

    await useWeatherStore.getState().fetchWeatherByCity("Hanoi,VN");

    expect(fetchWeatherByCity).not.toHaveBeenCalled();
  });

  it("forces refresh when requested", async () => {
    vi.mocked(fetchWeatherByCity).mockResolvedValue(createWeatherFixture({ main: { temp: 30, feels_like: 32, humidity: 70 } }));

    useWeatherStore.setState({
      weather: createWeatherFixture({
        main: { temp: 20, feels_like: 20, humidity: 50 },
        weather: [{ main: "Clouds", description: "cloudy", icon: "03d" }],
      }),
      lastFetchedCity: "Hanoi,VN",
      lastFetchedAt: Date.now(),
    });

    await useWeatherStore.getState().fetchWeatherByCity("Hanoi,VN", { force: true });

    expect(fetchWeatherByCity).toHaveBeenCalledTimes(1);
    expect(useWeatherStore.getState().weather?.main.temp).toBe(30);
  });
});
