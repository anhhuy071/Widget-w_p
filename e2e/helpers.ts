const weatherFixture = {
  main: { temp: 28, feels_like: 30, humidity: 72 },
  weather: [{ main: "Clear", description: "clear sky" }],
  wind: { speed: 2.4 },
  name: "Hanoi",
};

export const mockWeatherRoute = async (page: import("@playwright/test").Page) => {
  await page.route("**/api/weather**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(weatherFixture),
    });
  });
};

export const completeSetup = async (page: import("@playwright/test").Page) => {
  await page.getByLabel(/your name/i).fill("Alex");
  await page.getByLabel(/your city/i).selectOption("Hanoi,VN");
  await page.getByRole("button", { name: /save & continue/i }).click();
};
