import { describe, expect, it } from "vitest";
import { getGreeting } from "./greeting";

describe("getGreeting", () => {
  it("returns morning greeting before noon", () => {
    expect(getGreeting(8)).toBe("Good Morning");
  });

  it("returns afternoon greeting midday", () => {
    expect(getGreeting(14)).toBe("Good Afternoon");
  });

  it("returns evening greeting after work hours", () => {
    expect(getGreeting(19)).toBe("Good Evening");
  });

  it("returns night greeting late at night", () => {
    expect(getGreeting(23)).toBe("Good Night");
  });
});
