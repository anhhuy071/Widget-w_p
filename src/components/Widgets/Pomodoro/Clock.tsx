import { useEffect } from "react";
import { FiMinus, FiPause, FiPlay, FiPlus, FiRefreshCw } from "react-icons/fi";
import useClockStore from "../../../stores/clockStore";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const modeLabels = {
  work: "Focus",
  break: "Short break",
  longBreak: "Long break",
};

const Clock = () => {
  const {
    
    timeLeft,
    status,
    mode,
    settings,
    // sessions,
    tick,
    start,
    pause,
    resume,
    reset,
    saveSettings
  } = useClockStore();

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const totalSeconds = settings[mode] * 60;
  const percentage = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, tick]);

  const renderButtons = () => {
    if (status === "running") {
      return (
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          onClick={pause}
        >
          <FiPause aria-hidden="true" />
          Pause
        </button>
      );
    } else if (status === "paused") {
      return (
        <>
          <div className="flex flex-row gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              onClick={resume}
            >
              <FiPlay aria-hidden="true" />
              Resume
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-heading)] transition hover:bg-[var(--surface-muted)]"
              onClick={reset}
            >
              <FiRefreshCw aria-hidden="true" />
              Reset
            </button>
          </div>
        </>
      );
    }

    return null;
  };
  if (status === "idle")
    return (
      <section className="flex flex-col items-center justify-center gap-5">
        <div className="self-start">
          <p className="mb-2 text-xs font-semibold uppercase text-[var(--text-muted)]">
            Pomodoro
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--text-heading)]">
            {modeLabels[mode]} timer
          </h3>
        </div>
        <p className="font-mono text-5xl font-bold text-[var(--text-heading)]">
          {minutes}:{seconds}
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-1">
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-[var(--text-heading)] transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={()=> saveSettings({...settings , work: settings.work + 5})}
            disabled={settings.work >=60}
            aria-label="Increase focus duration"
          >
            <FiPlus aria-hidden="true" />
          </button>
          <span className="min-w-16 text-center text-sm font-semibold text-[var(--text-muted)]">
            {settings.work} min
          </span>
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-[var(--text-heading)] transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={()=> saveSettings({...settings , work: settings.work - 5})}
            disabled={settings.work <=10}
            aria-label="Decrease focus duration"
          >
            <FiMinus aria-hidden="true" />
          </button>
        </div>
        <div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            onClick={start}
          >
            <FiPlay aria-hidden="true" />
            Start
          </button>
        </div>
      </section>
    );

  return (
    <>
      <section className="flex flex-col items-center gap-5">
        <div className="self-start">
          <p className="mb-2 text-xs font-semibold uppercase text-[var(--text-muted)]">
            Pomodoro
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--text-heading)]">
            {modeLabels[mode]} in progress
          </h3>
        </div>
        <div className="w-48">
          <CircularProgressbar
            value={percentage}
            text={`${minutes}:${seconds}`}
            styles={buildStyles({
              pathColor: "var(--accent)",
              textColor: "var(--text-heading)",
              trailColor: "var(--surface-muted)",
            })}
          />
        </div>
        <div>{renderButtons()}</div>
      </section>
    </>
  );
};

export default Clock;
