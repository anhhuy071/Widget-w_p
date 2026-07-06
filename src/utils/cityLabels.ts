import { openWeatherCityOptions } from "../constants/weatherCities";

const cityLabelByValue = new Map(
  openWeatherCityOptions.map((option) => [option.value.toLowerCase(), option.label]),
);

export const getCityLabel = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const byValue = cityLabelByValue.get(trimmed.toLowerCase());
  if (byValue) return byValue;

  const byLabel = openWeatherCityOptions.find(
    (option) => option.label.toLowerCase() === trimmed.toLowerCase(),
  );
  return byLabel?.label ?? trimmed;
};
