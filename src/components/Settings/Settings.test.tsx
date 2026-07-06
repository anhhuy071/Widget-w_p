import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Settings from "./Settings";
import useProfileStore from "../../stores/profileStore";
import useClockStore, { DEFAULT_SETTINGS } from "../../stores/clockStore";

describe("Settings", () => {
  beforeEach(() => {
    useProfileStore.setState({
      name: "Alex",
      city: "Hanoi,VN",
      hasCompletedSetup: true,
      language: "en",
    });
    useClockStore.setState({
      settings: DEFAULT_SETTINGS,
      mode: "work",
      status: "idle",
      timeLeft: DEFAULT_SETTINGS.work * 60,
      sessions: 0,
    });
  });

  it("shows validation error when name is empty", async () => {
    const user = userEvent.setup();
    render(<Settings />);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "" } });
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Name cannot be empty.")).toBeInTheDocument();
  });

  it("shows success message after save", async () => {
    const user = userEvent.setup();
    render(<Settings />);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "Jordan" } });
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Settings saved successfully!")).toBeInTheDocument();
    expect(useProfileStore.getState().name).toBe("Jordan");
  });

  it("resets timer defaults from the form", async () => {
    const user = userEvent.setup();
    render(<Settings />);

    await user.click(screen.getByRole("button", { name: /reset/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(useClockStore.getState().settings).toEqual(DEFAULT_SETTINGS);
  });
});
