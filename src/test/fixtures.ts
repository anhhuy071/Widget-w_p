import type { WeatherData } from "../types/weather";

export const createWeatherFixture = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  name: "Hanoi",
  main: { temp: 28, feels_like: 30, humidity: 72 },
  weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
  wind: { speed: 2.4 },
  ...overrides,
});
