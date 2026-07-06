# Development Plan

## 1. Stabilize Current Product

- Review all current changes before release.
- Confirm Vietnam city/province selection works in both Startup Modal and Settings.
- Test weather fetch with several Vietnam locations.
- Handle existing localStorage profiles that may still contain older free-text city values.

## 2. Improve Location UX

- Keep the Vietnam weather city list in `src/constants/weatherCities.ts`.
- Add a searchable city selector if the list becomes hard to scan.
- Show user-friendly city labels in the UI while storing OpenWeather query values.
- Consider adding major districts or popular cities later if province-level weather is too broad.

## 3. Production Hardening

- Keep `WEATHER_API_KEY` only in Vercel environment variables.
- Confirm `/api/weather` works after every deployment.
- Improve weather error messages for missing API key, invalid city, and upstream failure.
- Maintain cache headers for static assets and weather responses.

## 4. Testing

- Add tests for profile store save behavior.
- Add tests for timer settings validation.
- Add tests for todo normalization and editing.
- Add UI smoke tests for first-run setup, Settings city changes, todo actions, and Pomodoro controls.

## 5. UX Polish

- Add success feedback after saving Settings.
- Add a weather refresh button.
- Display selected city labels cleanly instead of raw query values where appropriate.
- Review mobile spacing and text wrapping after each UI change.

## 6. Deployment Checklist

- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Deploy to Vercel preview.
- Verify production weather requests on the deployed URL.

## 7. Possible Next Features

- Task due dates or priorities.
- Completed task archive.
- Theme toggle.
- Pomodoro session history.
- Export or reset local dashboard data.
