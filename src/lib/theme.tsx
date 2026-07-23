import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.remove("light");
    root.classList.add("dark");
    root.style.setProperty("--bg-primary", "#0a111f");
    root.style.setProperty("--bg-secondary", "#0f1729");
    root.style.setProperty("--bg-card", "#0d1a2d");
    root.style.setProperty("--bg-card-hover", "#111f35");
    root.style.setProperty("--bg-input", "rgba(255,255,255,0.04)");
    root.style.setProperty("--text-primary", "#f1f5f9");
    root.style.setProperty("--text-secondary", "#94a3b8");
    root.style.setProperty("--text-muted", "#475569");
    root.style.setProperty("--border", "rgba(255,255,255,0.08)");
    root.style.setProperty("--border-strong", "rgba(255,255,255,0.15)");
    root.style.setProperty("--accent", "#22d3ee");
    root.style.setProperty("--accent-hover", "#06b6d4");
    root.style.setProperty("--accent-bg", "rgba(34,211,238,0.1)");
    root.style.setProperty("--danger", "#ef4444");
    root.style.setProperty("--danger-bg", "rgba(239,68,68,0.1)");
    root.style.setProperty("--success", "#10b981");
    root.style.setProperty("--success-bg", "rgba(16,185,129,0.1)");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.setProperty("--bg-primary", "#f8fafc");
    root.style.setProperty("--bg-secondary", "#f1f5f9");
    root.style.setProperty("--bg-card", "#ffffff");
    root.style.setProperty("--bg-card-hover", "#f8fafc");
    root.style.setProperty("--bg-input", "rgba(0,0,0,0.04)");
    root.style.setProperty("--text-primary", "#0f172a");
    root.style.setProperty("--text-secondary", "#475569");
    root.style.setProperty("--text-muted", "#94a3b8");
    root.style.setProperty("--border", "rgba(0,0,0,0.08)");
    root.style.setProperty("--border-strong", "rgba(0,0,0,0.15)");
    root.style.setProperty("--accent", "#0891b2");
    root.style.setProperty("--accent-hover", "#0e7490");
    root.style.setProperty("--accent-bg", "rgba(8,145,178,0.08)");
    root.style.setProperty("--danger", "#dc2626");
    root.style.setProperty("--danger-bg", "rgba(220,38,38,0.08)");
    root.style.setProperty("--success", "#059669");
    root.style.setProperty("--success-bg", "rgba(5,150,105,0.08)");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("mvp-theme");
    if (stored === "dark" || stored === "light") return stored;
    return "dark";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("mvp-theme", t);
    applyTheme(t);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
