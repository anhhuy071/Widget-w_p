import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWeatherFixture } from "../../../test/fixtures";
import WeatherWidget from "./Weather";
import useProfileStore from "../../../stores/profileStore";
import useWeatherStore from "../../../stores/weatherStore";

describe("WeatherWidget", () => {
  beforeEach(() => {
    vi.spyOn(useWeatherStore.getState(), "fetchWeatherByCity").mockResolvedValue(undefined);

    useProfileStore.setState({
      name: "Alex",
      city: "Hanoi,VN",
      hasCompletedSetup: true,
    });
    useWeatherStore.setState({
      weather: createWeatherFixture(),
      isLoading: false,
      hasError: false,
      errorMessage: null,
      lastFetchedCity: "Hanoi,VN",
      lastFetchedAt: Date.now(),
      pendingCity: "",
    });
  });

  it("renders forecast details for the selected city", () => {
    render(<WeatherWidget />);

    expect(screen.getByText("Ha Noi")).toBeInTheDocument();
    expect(screen.getByText("28°C")).toBeInTheDocument();
  });

  it("renders loading skeleton while fetching", () => {
    useWeatherStore.setState({
      weather: null,
      isLoading: true,
      hasError: false,
      errorMessage: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText("Local forecast")).toBeInTheDocument();
    expect(screen.queryByText("28°C")).not.toBeInTheDocument();
  });

  it("shows retry UI when weather fails", async () => {
    useWeatherStore.setState({
      weather: null,
      isLoading: false,
      hasError: true,
      errorMessage: "City not found",
    });

    const user = userEvent.setup();
    render(<WeatherWidget />);

    expect(screen.getByText("City not found")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /refresh weather/i }));
    expect(useWeatherStore.getState().fetchWeatherByCity).toHaveBeenCalled();
  });
});
