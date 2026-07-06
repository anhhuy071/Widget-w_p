export type WeatherErrorResponse = {
  error: string;
  code?: string;
};

export type WeatherSuccess = {
  ok: true;
  data: unknown;
};

export type WeatherFailure = {
  ok: false;
  statusCode: number;
  body: WeatherErrorResponse;
};

export type WeatherResult = WeatherSuccess | WeatherFailure;

type GeoResult = {
  lat: number;
  lon: number;
};

export const fetchWeatherForCity = async (
  city: string,
  lang: string,
  apiKey: string,
): Promise<WeatherResult> => {
  try {
    const geoUrl = new URL("https://api.openweathermap.org/geo/1.0/direct");
    geoUrl.searchParams.set("q", city);
    geoUrl.searchParams.set("limit", "1");
    geoUrl.searchParams.set("appid", apiKey);

    const geoResponse = await fetch(geoUrl.toString());
    if (!geoResponse.ok) {
      return {
        ok: false,
        statusCode: geoResponse.status,
        body: { error: "Unable to geocode city", code: "GEOCODE_FAILED" },
      };
    }

    const geoData = (await geoResponse.json()) as GeoResult[];
    const location = geoData[0];

    if (!location) {
      return {
        ok: false,
        statusCode: 404,
        body: { error: "City not found", code: "CITY_NOT_FOUND" },
      };
    }

    const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    weatherUrl.searchParams.set("lat", String(location.lat));
    weatherUrl.searchParams.set("lon", String(location.lon));
    weatherUrl.searchParams.set("units", "metric");
    weatherUrl.searchParams.set("lang", lang);
    weatherUrl.searchParams.set("appid", apiKey);

    const weatherResponse = await fetch(weatherUrl.toString());
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return {
        ok: false,
        statusCode: weatherResponse.status,
        body: {
          error: "Unable to fetch weather from upstream service",
          code: "UPSTREAM_FAILED",
        },
      };
    }

    return { ok: true, data: weatherData };
  } catch (error) {
    console.error("Weather upstream error:", error);
    return {
      ok: false,
      statusCode: 500,
      body: {
        error: "Failed to fetch weather data from upstream",
        code: "UPSTREAM_ERROR",
      },
    };
  }
};
