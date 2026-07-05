import type { IconType } from "react-icons";
import { useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  WiStrongWind,
  WiCloud,
  WiCloudy,
  WiDaySunny,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiThermometer,
  WiHumidity,
} from "react-icons/wi";
import useProfileStore from "../../../stores/profileStore";
import useWeatherStore from "../../../stores/weatherStore";
import { getCityLabel } from "../../../utils/cityLabels";

const weatherIconMap: Record<string, IconType> = {
  clear: WiDaySunny,
  clouds: WiCloudy,
  drizzle: WiRain,
  rain: WiRain,
  thunderstorm: WiThunderstorm,
  snow: WiSnow,
  mist: WiFog,
  smoke: WiFog,
  haze: WiFog,
  dust: WiCloud,
  fog: WiFog,
  sand: WiCloud,
  ash: WiCloud,
  squall: WiStrongWind,
  tornado: WiStrongWind,
};

const WeatherWidget = () => {
  const city = useProfileStore((state) => state.city);
  const cityLabel = getCityLabel(city);
  const { weather, isLoading, hasError, errorMessage, fetchWeatherByCity } = useWeatherStore();

  useEffect(() => {
    fetchWeatherByCity(city);
  }, [city, fetchWeatherByCity]);

  const handleRefresh = () => {
    fetchWeatherByCity(city, { force: true });
  };

  if (isLoading) {
    return (
      <section className="animate-pulse">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--text-muted)]">
          Local forecast
        </p>
        <div className="mb-4 h-8 w-40 rounded-lg bg-[var(--surface-muted)]" />
        <div className="mb-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[var(--surface-muted)]" />
          <div className="space-y-2">
            <div className="h-10 w-20 rounded bg-[var(--surface-muted)]" />
            <div className="h-4 w-28 rounded bg-[var(--surface-muted)]" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-[var(--surface-muted)]" />
          ))}
        </div>
      </section>
    );
  }

  if (hasError || !weather || !weather.weather || !weather.main) {
    return (
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            Local forecast{cityLabel ? ` · ${cityLabel}` : ""}
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-heading)] transition hover:bg-[var(--surface-muted)]"
            aria-label="Refresh weather"
          >
            <FiRefreshCw aria-hidden="true" />
            Retry
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <WiCloud className="text-5xl text-[var(--text-muted)]" />
          <h3 className="font-semibold text-[var(--text-heading)]">Unable to load forecast</h3>
          <p className="max-w-xs text-xs text-[var(--text-muted)]">
            {errorMessage ??
              "Check that the server has a weather API key configured and verify your city in Settings."}
          </p>
        </div>
      </section>
    );
  }

  const condition = weather.weather[0]?.main ?? "";
  const description = weather.weather[0]?.description ?? "";
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());
  const WeatherIcon = weatherIconMap[condition.toLowerCase()] || WiDaySunny;

  return (
    <section>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase text-[var(--text-muted)]">
            Local forecast
          </p>
          <h3 className="break-words text-2xl font-semibold tracking-tight text-[var(--text-heading)]">
            {cityLabel || weather.name}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-heading)] transition hover:bg-[var(--surface-muted)]"
            aria-label="Refresh weather"
          >
            <FiRefreshCw aria-hidden="true" />
            Refresh
          </button>
          <p className="text-right text-xs font-semibold uppercase text-[var(--text-muted)]">
            {todayLabel}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-5">
        <div className="text-6xl leading-none text-[var(--accent)]">
          <WeatherIcon aria-hidden="true" />
        </div>
        <div>
          <p className="text-5xl font-bold leading-none tracking-tight text-[var(--text-heading)]">
            {Math.round(weather.main.temp)}°C
          </p>
          <p className="mt-1 text-sm capitalize text-[var(--text-muted)]">
            {condition} · {description}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-1 rounded-lg bg-[var(--surface-muted)] p-3 text-center">
          <WiThermometer className="text-2xl text-[var(--accent)]" aria-hidden="true" />
          <dt className="text-[0.65rem] font-semibold uppercase text-[var(--text-muted)]">
            Feels like
          </dt>
          <dd className="text-sm font-semibold text-[var(--text-heading)]">
            {Math.round(weather.main.feels_like)}°C
          </dd>
        </div>

        <div className="flex flex-col items-center gap-1 rounded-lg bg-[var(--surface-muted)] p-3 text-center">
          <WiHumidity className="text-2xl text-[var(--accent)]" aria-hidden="true" />
          <dt className="text-[0.65rem] font-semibold uppercase text-[var(--text-muted)]">
            Humidity
          </dt>
          <dd className="text-sm font-semibold text-[var(--text-heading)]">
            {weather.main.humidity}%
          </dd>
        </div>

        <div className="flex flex-col items-center gap-1 rounded-lg bg-[var(--surface-muted)] p-3 text-center">
          <WiStrongWind className="text-2xl text-[var(--accent)]" aria-hidden="true" />
          <dt className="text-[0.65rem] font-semibold uppercase text-[var(--text-muted)]">
            Wind
          </dt>
          <dd className="text-sm font-semibold text-[var(--text-heading)]">
            {Math.round(weather.wind.speed)} m/s
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default WeatherWidget;
