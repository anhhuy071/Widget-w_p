import { expect, test } from "@playwright/test";
import { completeSetup, mockWeatherRoute } from "./helpers";

test.beforeEach(async ({ page }) => {
  await mockWeatherRoute(page);
  await page.goto("/");
});

test("home loads with greeting after setup", async ({ page }) => {
  await completeSetup(page);

  await expect(page.getByRole("heading", { name: /good/i })).toBeVisible();
  await expect(page.getByText("Todo List")).toBeVisible();
});

test("settings city change persists", async ({ page }) => {
  await completeSetup(page);

  await page.getByRole("link", { name: /settings/i }).click();
  await page.getByLabel(/^city$/i).selectOption("Ho Chi Minh City,VN");
  await page.getByRole("button", { name: /^save$/i }).click();

  await expect(page.getByText("Settings saved successfully.")).toBeVisible();
  await page.getByRole("link", { name: /home/i }).click();
  await expect(page.getByRole("heading", { name: "Ho Chi Minh City" })).toBeVisible();
});

test("todo add and complete flow works", async ({ page }) => {
  await completeSetup(page);

  await page.getByPlaceholder(/write your next task/i).fill("Prepare release");
  await page.getByRole("button", { name: /^add$/i }).click();
  await expect(page.getByText("Prepare release")).toBeVisible();

  await page.getByRole("checkbox", { name: /mark prepare release as complete/i }).check();
  await expect(page.getByText("Prepare release")).toHaveClass(/line-through/);
});

test("pomodoro start control works", async ({ page }) => {
  await completeSetup(page);

  await page.getByRole("button", { name: /^start$/i }).click();
  await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
});
