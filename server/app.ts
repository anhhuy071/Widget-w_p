import cors from "cors";
import express from "express";
import { fetchWeatherForCity } from "./weatherCore";
import { fetchMockNews } from "./newsCore";

const DEFAULT_CORS_ORIGINS = ["http://localhost:5173"];

const parseCorsOrigins = (): string[] => {
  const configured = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configured?.length ? configured : DEFAULT_CORS_ORIGINS;
};

const firstQueryValue = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
};

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: parseCorsOrigins(),
    }),
  );

  app.get("/api/weather", async (req, res) => {
    const city = firstQueryValue(req.query.city)?.trim() ?? "";
    const lang = firstQueryValue(req.query.lang)?.trim() || "en";

    if (!city) {
      return res.status(400).json({
        error: "City parameter is required",
        code: "CITY_REQUIRED",
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Weather API key is not configured on the server",
        code: "API_KEY_MISSING",
      });
    }

    const result = await fetchWeatherForCity(city, lang, apiKey);

    if (!result.ok) {
      return res.status(result.statusCode).json(result.body);
    }

    res.set("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    return res.json(result.data);
  });

  app.get("/api/news", (req, res) => {
    const categoriesQuery = req.query.categories;
    let categories: string[] | undefined = undefined;

    if (typeof categoriesQuery === "string") {
      categories = categoriesQuery
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }

    const articles = fetchMockNews(categories);
    res.set("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
    return res.json(articles);
  });

  return app;
};
