import { describe, expect, it } from "vitest";
import { normalizeTodoText } from "./todoUtils";

describe("normalizeTodoText", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeTodoText("  finish   report  ")).toBe("finish report");
  });

  it("enforces max length", () => {
    expect(normalizeTodoText("x".repeat(200))).toHaveLength(160);
  });

  it("returns empty string for whitespace-only input", () => {
    expect(normalizeTodoText("   ")).toBe("");
  });
});
