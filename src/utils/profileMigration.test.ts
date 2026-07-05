import { describe, expect, it } from "vitest";
import { DEFAULT_CITY_VALUE, resolveCityValue } from "./profileMigration";

describe("resolveCityValue", () => {
  it("returns valid stored city values unchanged", () => {
    expect(resolveCityValue("Hanoi,VN")).toBe("Hanoi,VN");
  });

  it("maps legacy label text to OpenWeather value", () => {
    expect(resolveCityValue("Ha Noi")).toBe("Hanoi,VN");
  });

  it("falls back to default for unknown values", () => {
    expect(resolveCityValue("Random Place")).toBe(DEFAULT_CITY_VALUE);
  });

  it("returns default for empty input", () => {
    expect(resolveCityValue("")).toBe(DEFAULT_CITY_VALUE);
  });
});
