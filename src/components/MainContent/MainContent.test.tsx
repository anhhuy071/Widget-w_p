import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWeatherFixture } from "../../test/fixtures";
import MainContent from "./MainContent";
import useProfileStore from "../../stores/profileStore";
import useWeatherStore from "../../stores/weatherStore";

vi.mock("../StartupModal/StartupModal", () => ({
  default: () => null,
}));

describe("MainContent", () => {
  beforeEach(() => {
    vi.spyOn(useWeatherStore.getState(), "fetchWeatherByCity").mockResolvedValue(undefined);

    useProfileStore.setState({
      name: "Alex",
      city: "Hanoi,VN",
      hasCompletedSetup: true,
      language: "en",
    });
    useWeatherStore.setState({
      weather: createWeatherFixture({ main: { temp: 24, feels_like: 25, humidity: 60 } }),
      isLoading: false,
      hasError: false,
      errorMessage: null,
      lastFetchedCity: "Hanoi,VN",
      lastFetchedAt: Date.now(),
      pendingCity: "",
    });
  });

  it("renders personalized greeting and weather summary", () => {
    render(<MainContent />);

    expect(screen.getByText(/Alex/)).toBeInTheDocument();
    expect(screen.getAllByText(/Ha Noi/).length).toBeGreaterThan(0);
    expect(screen.getByText(/24°C/)).toBeInTheDocument();
    expect(screen.getByText(/Clear/)).toBeInTheDocument();
    expect(screen.getByText("Todo List")).toBeInTheDocument();
  });

  it("shows placeholder weather when forecast is unavailable", () => {
    useWeatherStore.setState({ weather: null });

    render(<MainContent />);

    expect(screen.getByText("Unable to load forecast")).toBeInTheDocument();
  });
});
