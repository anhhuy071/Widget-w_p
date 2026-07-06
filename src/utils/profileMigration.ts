import { openWeatherCityOptions } from "../constants/weatherCities";

export const DEFAULT_CITY_VALUE = "Hanoi,VN";

const validCityValues = new Set(
  openWeatherCityOptions.map((option) => option.value.toLowerCase()),
);

export const resolveCityValue = (storedCity: string): string => {
  const trimmed = storedCity.trim();
  if (!trimmed) return DEFAULT_CITY_VALUE;

  if (validCityValues.has(trimmed.toLowerCase())) {
    return trimmed;
  }

  const byLabel = openWeatherCityOptions.find(
    (option) => option.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (byLabel) return byLabel.value;

  const fuzzy = openWeatherCityOptions.find((option) =>
    option.label.toLowerCase().includes(trimmed.toLowerCase()),
  );
  if (fuzzy) return fuzzy.value;

  return DEFAULT_CITY_VALUE;
};
