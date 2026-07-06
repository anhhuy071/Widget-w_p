import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import StartupModal from "./StartupModal";
import useProfileStore from "../../stores/profileStore";

describe("StartupModal", () => {
  beforeEach(() => {
    useProfileStore.setState({
      name: "",
      city: "",
      hasCompletedSetup: false,
      language: "en",
    });
  });

  it("does not save profile when required fields are missing", async () => {
    const user = userEvent.setup();
    render(<StartupModal />);

    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    expect(useProfileStore.getState().hasCompletedSetup).toBe(false);
  });

  it("saves profile when form is valid", async () => {
    const user = userEvent.setup();
    render(<StartupModal />);

    await user.type(screen.getByLabelText(/name/i), "Alex");
    await user.selectOptions(screen.getByLabelText(/city/i), "Hanoi,VN");
    await user.click(screen.getByRole("button", { name: /save & continue/i }));

    expect(useProfileStore.getState().name).toBe("Alex");
    expect(useProfileStore.getState().city).toBe("Hanoi,VN");
    expect(useProfileStore.getState().hasCompletedSetup).toBe(true);
  });
});
