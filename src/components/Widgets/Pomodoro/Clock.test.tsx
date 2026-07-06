import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import Clock from "./Clock";
import useClockStore, { DEFAULT_SETTINGS } from "../../../stores/clockStore";

describe("Clock", () => {
  beforeEach(() => {
    useClockStore.setState({
      mode: "work",
      status: "idle",
      settings: DEFAULT_SETTINGS,
      timeLeft: DEFAULT_SETTINGS.work * 60,
      sessions: 0,
    });
  });

  it("renders start control in idle state", () => {
    render(<Clock />);
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    expect(screen.getByText(/focus timer/i)).toBeInTheDocument();
  });

  it("starts the timer when start is clicked", async () => {
    const user = userEvent.setup();
    render(<Clock />);

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(useClockStore.getState().status).toBe("running");
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });
});
