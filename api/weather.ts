import { fetchWeatherForCity } from "../server/weatherCore";

type QueryValue = string | string[] | undefined;

type ServerlessRequest = {
  headers?: {
    host?: string;
  };
  query?: Record<string, QueryValue>;
  url?: string;
};

type ServerlessResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

type WeatherErrorResponse = {
  error: string;
  code?: string;
};

const json = (res: ServerlessResponse, statusCode: number, body: unknown) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify(body));
};

const weatherError = (
  res: ServerlessResponse,
  statusCode: number,
  error: string,
  code?: string,
) => json(res, statusCode, { error, code } satisfies WeatherErrorResponse);

const firstValue = (value: QueryValue) => (Array.isArray(value) ? value[0] : value);

export const readQuery = (req: ServerlessRequest) => {
  const base = `http://${req.headers?.host || "localhost"}`;
  const parsedUrl = new URL(req.url || "/", base);
  const searchQuery = Object.fromEntries(parsedUrl.searchParams.entries());

  return {
    ...searchQuery,
    ...req.query,
  };
};

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  const query = readQuery(req);
  const city = firstValue(query.city)?.trim();
  const lang = firstValue(query.lang)?.trim() || "en";

  if (!city) {
    return weatherError(res, 400, "City parameter is required", "CITY_REQUIRED");
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return weatherError(
      res,
      500,
      "Weather API key is not configured on the server",
      "API_KEY_MISSING",
    );
  }

  const result = await fetchWeatherForCity(city, lang, apiKey);

  if (!result.ok) {
    return weatherError(res, result.statusCode, result.body.error, result.body.code);
  }

  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
  return json(res, 200, result.data);
}
