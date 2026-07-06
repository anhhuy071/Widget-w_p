# Contributing to Pulse Board

## Development workflow

1. Install dependencies: `npm install`
2. Copy environment template: `cp .env.example .env`
3. Run the dev server: `npm run dev`

## Quality checks

Run these before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run test:e2e
```

## Deployment checklist

1. Confirm CI is green on the target branch.
2. Ensure `WEATHER_API_KEY` is set in Vercel project settings.
3. Verify Vercel Root Directory is `.` (repository root, not the legacy `Dashboard/` subfolder).
4. Deploy preview and confirm `/api/weather?city=Hanoi,VN` returns data.
5. Smoke-test first-run setup, Settings save, todo actions, and Pomodoro controls on the deployed URL.
6. Validate legacy profile city values migrate correctly after release.

## Scope note

This repository ships the Pulse Board personal dashboard only. Do not add Cursor, Agtest, or other agent harness tooling to this project.
