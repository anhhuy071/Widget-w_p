import { useState, useEffect } from "react";
import { FaHome, FaRegNewspaper } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import useProfileStore from "../../stores/profileStore";
import { useTranslation } from "../../utils/translations";

const navItems = [
  {
    label: "home",
    href: "/",
    icon: FaHome,
  },
  {
    label: "news",
    href: "/news",
    icon: FaRegNewspaper,
  },
  {
    label: "settings",
    href: "/settings",
    icon: IoIosSettings,
  },
];

function useTimeStatus() {
  const getStatus = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "morningFlow";
    if (h >= 12 && h < 17) return "afternoonSession";
    if (h >= 17 && h < 21) return "eveningWinddown";
    return "nightMode";
  };
  const [status, setStatus] = useState(getStatus);
  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
}

const ThemeToggle = () => {
  const { theme, setTheme } = useProfileStore();
  const { t } = useTranslation();

  const cycleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const getIcon = () => {
    if (theme === "light") return <FiSun />;
    if (theme === "dark") return <FiMoon />;
    return <FiMonitor />;
  };

  const getLabel = () => {
    if (theme === "light") return t("light");
    if (theme === "dark") return t("dark");
    return t("system");
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-secondary)] cursor-pointer"
      title={`${t("themeLabel")} (Current: ${getLabel()})`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] text-base">
        {getIcon()}
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-[0.65rem] font-semibold uppercase text-[var(--text-muted)]">{t("themeLabel")}</span>
        <span className="text-sm font-medium tracking-[0.01em]">{getLabel()}</span>
      </div>
    </button>
  );
};

export default function SideBar() {
  const timeStatus = useTimeStatus();
  const { t } = useTranslation();
  return (
    <aside className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 px-3 py-3 backdrop-blur lg:h-screen lg:border-b-0 lg:border-r lg:border-[var(--border)] lg:px-4 lg:py-4">
      <div className="flex h-full flex-col gap-3 lg:gap-0">
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-sm font-black text-[var(--accent)]">
            PB
          </div>

          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase text-[var(--text-muted)]">
              Dashboard
            </p>
            <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--text-heading)] sm:text-3xl">
              Pulse Board
            </h1>
          </div>
        </div>

        <div className="lg:mt-8">
          <p className="hidden px-3 text-[0.65rem] font-semibold uppercase text-[var(--text-muted)] lg:block">
            {t("home")}
          </p>
          <nav className="mt-3" aria-label="Primary">
            <ul className="grid grid-cols-2 gap-2 lg:block lg:space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg border px-3 py-3 transition-colors duration-200 ${
                          isActive
                            ? "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-heading)]"
                            : "border-transparent bg-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-base transition-colors ${
                              isActive
                                ? "border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]"
                                : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] group-hover:text-[var(--text)] group-hover:border-[var(--border)]"
                            }`}
                          >
                            <Icon />
                          </div>

                          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <span className="truncate text-sm font-medium tracking-[0.01em]">
                              {t(item.label as any)}
                            </span>
                            {isActive ? (
                              <span className="hidden rounded-full border border-[var(--border)] px-2 py-1 text-[0.62rem] font-semibold uppercase text-[var(--text-muted)] sm:inline">
                                {t("live")}
                              </span>
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--text-muted)]" />
                            )}
                          </div>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-auto pt-8">
          <div className="flex flex-col gap-3">
            <ThemeToggle />
            <div className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 lg:block">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{t("online")}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t(timeStatus as any)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
