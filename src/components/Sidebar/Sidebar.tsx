import { useState, useEffect } from "react";
import { FaHome, FaRegNewspaper } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: FaHome,
  },
  {
    label: "News",
    href: "/news",
    icon: FaRegNewspaper,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: IoIosSettings,
  },
];

function useTimeStatus() {
  const getStatus = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Morning Flow";
    if (h >= 12 && h < 17) return "Afternoon Session";
    if (h >= 17 && h < 21) return "Evening Wind-down";
    return "Night Mode";
  };
  const [status, setStatus] = useState(getStatus);
  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
}

export default function SideBar() {
  const timeStatus = useTimeStatus();
  return (
    <aside className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 px-3 py-3 backdrop-blur lg:h-screen lg:border-b-0 lg:border-r lg:px-4 lg:py-4">
      <div className="flex h-full flex-col gap-3 lg:gap-0">
        <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-sm font-black text-emerald-200">
            PB
          </div>

          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase text-slate-500">
              Dashboard
            </p>
            <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--text-heading)] sm:text-3xl">
              Pulse Board
            </h1>
          </div>
        </div>

        <div className="lg:mt-8">
          <p className="hidden px-3 text-[0.65rem] font-semibold uppercase text-slate-500 lg:block">
            Navigation
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
                            ? "border-slate-800 bg-slate-900 text-white"
                            : "border-transparent bg-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/70 hover:text-slate-200"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-base transition-colors ${
                              isActive
                                ? "border-slate-700 bg-slate-950 text-white"
                                : "border-slate-800 bg-slate-950 text-slate-400 group-hover:text-slate-200"
                            }`}
                          >
                            <Icon />
                          </div>

                          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <span className="truncate text-sm font-medium tracking-[0.01em]">
                              {item.label}
                            </span>
                            {isActive ? (
                              <span className="hidden rounded-full border border-slate-700 px-2 py-1 text-[0.62rem] font-semibold uppercase text-slate-300 sm:inline">
                                Live
                              </span>
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-slate-500" />
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

        <div className="mt-auto hidden pt-8 lg:block">
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">Online</p>
                <p className="text-xs text-slate-500">{timeStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
