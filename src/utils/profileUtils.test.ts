import { describe, expect, it } from "vitest";
import { normalizeProfileValue } from "./profileUtils";

describe("normalizeProfileValue", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeProfileValue("  Alex   Nguyen  ", 60)).toBe("Alex Nguyen");
  });

  it("enforces max length", () => {
    expect(normalizeProfileValue("a".repeat(80), 60)).toHaveLength(60);
  });
});
