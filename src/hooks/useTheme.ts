import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "../lib/theme-config";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme");
      setIsDark(savedTheme === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  return {
    isDark,
    theme,
    colors: theme.colors,
    accent: theme.colors.accent,
  };
}
