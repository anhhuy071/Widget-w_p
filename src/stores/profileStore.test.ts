import { beforeEach, describe, expect, it } from "vitest";
import useProfileStore from "./profileStore";

describe("useProfileStore", () => {
  beforeEach(() => {
    useProfileStore.setState({
      name: "",
      city: "",
      hasCompletedSetup: false,
    });
  });

  it("normalizes and saves profile values", () => {
    useProfileStore.getState().saveProfile("  Alex  ", "Hanoi,VN");

    expect(useProfileStore.getState()).toMatchObject({
      name: "Alex",
      city: "Hanoi,VN",
      hasCompletedSetup: true,
    });
  });

  it("resolves legacy city labels when saving", () => {
    useProfileStore.getState().saveProfile("Alex", "Ha Noi");

    expect(useProfileStore.getState().city).toBe("Hanoi,VN");
  });
});
