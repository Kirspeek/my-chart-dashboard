"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

const lightVars: Record<string, string> = {
  "--color-bg": "#f6f6f6",
  "--color-bg-card": "rgba(35, 35, 35, 0.07)",
  "--color-black": "#232323",
  "--color-gray": "#888",
  "--color-gray-light": "#b0b0a8",
  "--color-border": "#232323",
  "--color-border-secondary": "#e0e0e0",
  "--accent-yellow": "#ffdd6d",
  "--accent-teal": "#425b59",
  "--accent-red": "#ea4300",
  "--accent-blue": "#7bc2e8",
  "--theme-bg": "#f6f6f6",
  "--theme-bg-card": "rgba(35, 35, 35, 0.07)",
  "--theme-border": "#e0e0e0",
  "--theme-text": "#232323",
  "--theme-text-secondary": "#888",
  "--theme-accent-1": "#ffdd6d",
  "--theme-accent-2": "#425b59",
  "--theme-accent-3": "#ea4300",
  "--theme-accent-4": "#7bc2e8",
  "--weather-bg-clear": "linear-gradient(135deg, #ffe88a 0%, #ffd34d 100%)",
  "--weather-bg-sunny": "linear-gradient(135deg, #ffe88a 0%, #ffd34d 100%)",
  "--weather-bg-partly-cloudy":
    "linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)",
  "--weather-bg-partly-cloudy-button":
    "linear-gradient(135deg, #e3f0ff 0%, #b3d8f7 100%)",
  "--weather-bg-cloudy": "linear-gradient(135deg, #e0e0e0 0%, #b0b0a8 100%)",
  "--weather-bg-rain": "linear-gradient(to bottom, #3a7ca5 0%, #4a90c2 100%)",
  "--weather-bg-showers":
    "linear-gradient(to bottom, #3a7ca5 0%, #4a90c2 100%)",
  "--weather-bg-showers-button":
    "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)",
  "--weather-bg-drizzle":
    "linear-gradient(to bottom, #b3d8f7 0%, #7bc2e8 100%)",
  "--weather-bg-snow": "linear-gradient(135deg, #f8fafc 0%, #e0e0e0 100%)",
  "--weather-bg-fog": "linear-gradient(135deg, #dbe6ef 0%, #b0b0a8 100%)",
  "--weather-bg-thunderstorm":
    "linear-gradient(135deg, #232323 0%, #7bc2e8 100%)",
  "--weather-bg-hot": "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)",
  "--weather-bg-cold": "linear-gradient(135deg, #b3d8f7 0%, #425b59 100%)",
  "--weather-text-clear": "#ea7a00",
  "--weather-text-sunny": "#ea7a00",
  "--weather-text-partly-cloudy": "#23405c",
  "--weather-text-cloudy": "#425b59",
  "--weather-text-rain": "#23405c",
  "--weather-text-showers": "#23405c",
  "--weather-text-drizzle": "#23405c",
  "--weather-text-snow": "#425b59",
  "--weather-text-fog": "#888",
  "--weather-text-thunderstorm": "#fff",
  "--weather-text-hot": "#fff",
  "--weather-text-cold": "#23405c",
  "--weather-orange": "#ea7a00",
};

const darkVars: Record<string, string> = {
  "--color-bg": "#1a1a1a",
  "--color-bg-card": "rgba(255, 255, 255, 0.05)",
  "--color-black": "#ffffff",
  "--color-gray": "#a0a0a0",
  "--color-gray-light": "#808080",
  "--color-border": "#404040",
  "--color-border-secondary": "#333333",
  "--accent-yellow": "#ffdd6d",
  "--accent-teal": "#5a7a78",
  "--accent-red": "#ff6b4a",
  "--accent-blue": "#7bc2e8",
  "--theme-bg": "#1a1a1a",
  "--theme-bg-card": "rgba(255, 255, 255, 0.05)",
  "--theme-border": "transparent", // remove borders
  "--theme-border-secondary": "transparent", // remove secondary borders
  "--theme-text": "#f5f5f5", // almost white for primary text
  "--theme-text-secondary": "#a0a0a0",
  "--theme-accent-1": "#ffdd6d",
  "--theme-accent-2": "#5a7a78",
  "--theme-accent-3": "#ff6b4a",
  "--theme-accent-4": "#7bc2e8",
  "--weather-bg-clear": "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
  "--weather-bg-sunny": "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
  "--weather-bg-partly-cloudy":
    "linear-gradient(135deg, #3a4a5a 0%, #4a6a8a 100%)",
  "--weather-bg-partly-cloudy-button":
    "linear-gradient(135deg, #3a4a5a 0%, #4a6a8a 100%)",
  "--weather-bg-cloudy": "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
  "--weather-bg-rain": "linear-gradient(to bottom, #1a3a5a 0%, #2a4a6a 100%)",
  "--weather-bg-showers":
    "linear-gradient(to bottom, #1a3a5a 0%, #2a4a6a 100%)",
  "--weather-bg-showers-button":
    "linear-gradient(165deg, #4a2a1a 0%, #5a3a2a 100%)",
  "--weather-bg-drizzle":
    "linear-gradient(to bottom, #1a3a5a 0%, #2a4a6a 100%)",
  "--weather-bg-snow": "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
  "--weather-bg-fog": "linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)",
  "--weather-bg-thunderstorm":
    "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
  "--weather-bg-hot": "linear-gradient(165deg, #4a2a1a 0%, #5a3a2a 100%)",
  "--weather-bg-cold": "linear-gradient(135deg, #1a3a5a 0%, #2a4a6a 100%)",
  "--weather-text-clear": "#ffdd6d",
  "--weather-text-sunny": "#ffdd6d",
  "--weather-text-partly-cloudy": "#7bc2e8",
  "--weather-text-cloudy": "#a0a0a0",
  "--weather-text-rain": "#7bc2e8",
  "--weather-text-showers": "#7bc2e8",
  "--weather-text-drizzle": "#7bc2e8",
  "--weather-text-snow": "#a0a0a0",
  "--weather-text-fog": "#a0a0a0",
  "--weather-text-thunderstorm": "#ffffff",
  "--weather-text-hot": "#ffffff",
  "--weather-text-cold": "#7bc2e8",
  "--weather-orange": "#ff6b4a",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    const vars = theme === "light" ? lightVars : darkVars;
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
