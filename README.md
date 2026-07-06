# Pulse Board

Pulse Board is a responsive personal productivity dashboard for daily focus. It combines a personalized greeting, local time, Vietnam weather lookup, task management, and a configurable Pomodoro timer in one clean workspace.

This repository contains the production app only — no Cursor or Agtest agent harness tooling.

## Live Demo

Production: [https://widget-w-p.vercel.app](https://widget-w-p.vercel.app)

## Features

- First-run setup modal for name and Vietnam city/province selection
- Weather widget powered by OpenWeather through a server-side proxy
- Vietnam-only location selector shared by Startup Modal and Settings
- Persistent todo list with add, edit, complete, and delete actions
- Pomodoro timer with configurable work, short break, and long break durations
- Responsive sidebar and dashboard layout for desktop and mobile
- Local persistence with Zustand so profile, tasks, and timer settings survive reloads
- Legacy profile city migration for older localStorage values

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Zustand
- Framer Motion
- React Icons
- Express (standalone backend) + Vercel Serverless Functions
- Vitest + Testing Library + Playwright

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your OpenWeather key:

```bash
WEATHER_API_KEY=your_openweather_key_for_weather_proxy
```

Optional: set `VITE_WEATHER_API_KEY` to call OpenWeather directly from the browser during Vite dev without the backend.

Start frontend and backend together:

```bash
npm run dev
```

This runs Vite on port 5173 and the Express API on port 3001. Vite proxies `/api/*` to the backend.

Run only the frontend or backend when needed:

```bash
npm run dev:client
npm run dev:server
```

## Environment Variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `WEATHER_API_KEY` | Vercel function + Express backend | Server-side OpenWeather proxy key |
| `VITE_WEATHER_API_KEY` | Vite dev client (optional) | Direct browser calls without backend |
| `PORT` | Express backend | API port (default `3001`) |
| `CORS_ORIGIN` | Express backend | Allowed browser origin(s), comma-separated |
| `VITE_API_PROXY_TARGET` | Vite dev server | Backend URL for `/api` proxy |

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run test:e2e
```

## Deployment Options

### Vercel (default)

The browser calls `/api/weather`, and the serverless function at `api/weather.ts` injects `WEATHER_API_KEY` before contacting OpenWeather. This keeps the production API key out of the client bundle.

Vercel also applies security and cache headers from `vercel.json`.

Set the Vercel **Root Directory** to `.` (repository root).

### Self-hosted backend

For local development or self-hosted deployments, run the Express backend:

```bash
npm run build
npm run start
```

The backend exposes `GET /api/weather?city=&lang=` with the same response and error shape as the Vercel function. Shared weather logic lives in `server/weatherCore.ts` and is reused by both runtimes.

Serve the Vite build (`dist/`) from your web server and reverse-proxy `/api` to the Express process, or run the frontend and API on separate hosts with `CORS_ORIGIN` configured.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full deployment checklist.

## Project Structure

```text
api/                         Vercel serverless functions
server/                      Express backend + shared weather core
e2e/                         Playwright smoke tests
src/components/              Dashboard UI components
src/constants/weatherCities.ts Vietnam city/province options
src/layouts/                 App layout shell
src/services/                API client services
src/stores/                  Zustand stores
src/test/                    Vitest setup helpers
src/types/                   Shared TypeScript types
src/utils/                   Pure helpers and migrations
```

## CI

GitHub Actions runs lint, typecheck, unit/integration tests with coverage, build, and Playwright smoke tests on push and pull requests.
