"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getServerSnapshot(): Theme | null {
  return null;
}
export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
  }
  listeners.forEach((cb) => cb());
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const toggle = () => setTheme(readTheme() === "dark" ? "light" : "dark");

  const label =
    theme === "dark"
      ? "Switch to light mode"
      : theme === "light"
        ? "Switch to dark mode"
        : "Toggle colour theme";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <svg
        className="icon-moon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M20.6 14.3A8.5 8.5 0 0 1 9.7 3.4a.6.6 0 0 0-.7-.8A9.5 9.5 0 1 0 21.4 15a.6.6 0 0 0-.8-.7Z"
        />
      </svg>
      <svg
        className="icon-sun"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4.6" fill="currentColor" />
        <g
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </g>
      </svg>
    </button>
  );
}
