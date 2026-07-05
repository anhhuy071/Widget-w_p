import { beforeEach, describe, expect, it } from "vitest";
import useClockStore, { DEFAULT_SETTINGS, validateSettings } from "../stores/clockStore";

describe("validateSettings", () => {
  it("clamps work duration between 10 and 60", () => {
    expect(validateSettings({ work: 5, break: 5, longBreak: 15 }).work).toBe(10);
    expect(validateSettings({ work: 90, break: 5, longBreak: 15 }).work).toBe(60);
  });

  it("clamps break duration between 5 and 30", () => {
    expect(validateSettings({ work: 25, break: 1, longBreak: 15 }).break).toBe(5);
    expect(validateSettings({ work: 25, break: 45, longBreak: 15 }).break).toBe(30);
  });

  it("clamps long break between 15 and 60", () => {
    expect(validateSettings({ work: 25, break: 5, longBreak: 5 }).longBreak).toBe(15);
    expect(validateSettings({ work: 25, break: 5, longBreak: 90 }).longBreak).toBe(60);
  });
});

describe("useClockStore actions", () => {
  beforeEach(() => {
    useClockStore.setState({
      mode: "work",
      status: "idle",
      settings: DEFAULT_SETTINGS,
      timeLeft: DEFAULT_SETTINGS.work * 60,
      sessions: 0,
    });
  });

  it("pauses and resumes a running timer", () => {
    useClockStore.getState().start();
    useClockStore.getState().pause();
    expect(useClockStore.getState().status).toBe("paused");

    useClockStore.getState().resume();
    expect(useClockStore.getState().status).toBe("running");
  });

  it("ticks down remaining time while running", () => {
    useClockStore.setState({ status: "running", timeLeft: 2 });
    useClockStore.getState().tick();
    expect(useClockStore.getState().timeLeft).toBe(1);
  });

  it("resets timer state", () => {
    useClockStore.setState({ status: "running", sessions: 2, timeLeft: 100 });
    useClockStore.getState().reset();
    expect(useClockStore.getState().status).toBe("idle");
    expect(useClockStore.getState().sessions).toBe(0);
  });

  it("saveSettings and resetDefault update durations", () => {
    useClockStore.getState().saveSettings({ work: 30, break: 10, longBreak: 20 });
    expect(useClockStore.getState().settings.work).toBe(30);

    useClockStore.getState().resetDefault();
    expect(useClockStore.getState().settings.work).toBe(DEFAULT_SETTINGS.work);
  });

  it("switches to break mode when a work session completes", () => {
    useClockStore.setState({
      status: "running",
      mode: "work",
      timeLeft: 1,
      sessions: 0,
      settings: DEFAULT_SETTINGS,
    });

    useClockStore.getState().tick();

    expect(useClockStore.getState().mode).toBe("break");
    expect(useClockStore.getState().sessions).toBe(1);
  });
});
