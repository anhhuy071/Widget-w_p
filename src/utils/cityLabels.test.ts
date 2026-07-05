import { describe, expect, it } from "vitest";
import { getCityLabel } from "./cityLabels";

describe("getCityLabel", () => {
  it("returns label for known city value", () => {
    expect(getCityLabel("Hanoi,VN")).toBe("Ha Noi");
  });

  it("returns input when value is unknown", () => {
    expect(getCityLabel("Unknown City")).toBe("Unknown City");
  });

  it("returns empty string for blank input", () => {
    expect(getCityLabel("")).toBe("");
  });
});
