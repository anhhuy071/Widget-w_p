import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Settings {
  work: number;
  break: number;
  longBreak: number;
}

export const DEFAULT_SETTINGS: Settings = {
  work: 25,
  break: 5,
  longBreak: 15,
};

export const validateSettings = (s: Settings): Settings => ({
  work: Math.min(Math.max(s.work, 10), 60),
  break: Math.min(Math.max(s.break, 5), 30),
  longBreak: Math.min(Math.max(s.longBreak, 15), 60),
});

export type ClockStore = {
  mode: "work" | "break" | "longBreak";
  status: "idle" | "running" | "paused" | "finished";
  timeLeft: number;
  sessions: number;
  settings: Settings;
  // actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  saveSettings: (newSettings: Settings) => void;
  resetDefault: () => void;
};

const useClockStore = create<ClockStore>()(
  persist(
    (set, get) => ({
      mode: "work",
      status: "idle",
      settings: DEFAULT_SETTINGS,
      timeLeft: DEFAULT_SETTINGS.work * 60,
      sessions: 0,

      start: () => set({ status: "running" }),
      pause: () => set({ status: "paused" }),
      resume: () => set({ status: "running" }),

      reset: () => {
        const { settings } = get();
        set({
          status: "idle",
          mode: "work",
          timeLeft: settings.work * 60,
          sessions: 0,
        });
      },

      tick: () => {
        const { timeLeft, sessions, settings, mode } = get();

        if (timeLeft > 1) {
          set({ timeLeft: timeLeft - 1 });
          return;
        }

        const newSessions = mode === "work" ? sessions + 1 : sessions;
        const nextMode: ClockStore["mode"] =
          mode === "work"
            ? newSessions % 4 === 0
              ? "longBreak"
              : "break"
            : "work";

        if (mode === "work") {
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1.2);
          } catch { /* AudioContext not available */ }
        }

        set({
          timeLeft: settings[nextMode] * 60,
          mode: nextMode,
          sessions: newSessions,
          status: mode === "work" ? "running" : "idle",
        });
      },

      saveSettings: (newSettings: Settings) => {
        const { mode } = get();
        const validated = validateSettings(newSettings);
        set({
          settings: validated,
          timeLeft: validated[mode] * 60,
        });
      },

      resetDefault: () => {
        const { mode } = get();
        set({
          settings: DEFAULT_SETTINGS,
          timeLeft: DEFAULT_SETTINGS[mode] * 60,
        });
      },
    }),
    {
      name: "pomodoro-storage",
      partialize: (state) => ({
        settings: state.settings,
        sessions: state.sessions,
        timeLeft: state.timeLeft,
      }),
    },
  ),
);

export default useClockStore;
