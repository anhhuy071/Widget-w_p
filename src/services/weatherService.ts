import axios from "axios";
import type { WeatherData } from "../types/weather";

const directAxios = axios.create({
  baseURL: "https://api.openweathermap.org",
  params: { units: "metric", lang: "en" },
});

type WeatherErrorBody = {
  error?: string;
  code?: string;
};

const mapWeatherError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const body = error.response?.data as WeatherErrorBody | undefined;
    const serverMessage = body?.error;

    if (status === 400) {
      return new Error(serverMessage ?? "Please select a valid city.");
    }
    if (status === 404) {
      return new Error(serverMessage ?? "City not found. Choose a city from Settings.");
    }
    if (status === 500) {
      return new Error(
        serverMessage ?? "Weather service is not configured. Contact the site administrator.",
      );
    }
    if (status === 502 || status === 503) {
      return new Error(serverMessage ?? "Weather service is temporarily unavailable. Try again.");
    }
    if (error.code === "ERR_NETWORK") {
      return new Error("Unable to reach the weather service. Check your connection.");
    }
    return new Error(serverMessage ?? "Unable to load weather right now.");
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Unable to load weather right now.");
};

export const fetchWeatherByCity = async (city: string, lang: string = "en"): Promise<WeatherData> => {
  const trimmedCity = city.trim();
  if (!trimmedCity) {
    throw new Error("City is required");
  }

  const localKey = import.meta.env.VITE_WEATHER_API_KEY;

  try {
    if (import.meta.env.DEV && localKey) {
      const geo = await directAxios.get("/geo/1.0/direct", {
        params: { q: trimmedCity, limit: 1, appid: localKey },
      });

      if (!geo.data || geo.data.length === 0) {
        throw new Error("City not found. Choose a city from Settings.");
      }

      const { lat, lon } = geo.data[0];
      const res = await directAxios.get("/data/2.5/weather", {
        params: { lat, lon, appid: localKey, lang },
      });

      return res.data;
    }

    const baseUrl = import.meta.env.VITE_API_URL || "";
    const res = await axios.get(`${baseUrl}/api/weather`, {
      params: {
        city: trimmedCity,
        lang,
      },
    });

    if (!res.data?.main || !res.data?.weather) {
      throw new Error("Weather service returned an unexpected response");
    }

    return res.data;
  } catch (error) {
    throw mapWeatherError(error);
  }
};
