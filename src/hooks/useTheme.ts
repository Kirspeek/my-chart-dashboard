import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "@/constants/theme";
import { getColorsTheme } from "@/theme/colorsTheme";

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
  const colorsTheme = getColorsTheme(isDark);

  return {
    isDark,
    theme,
    colors: theme.colors,
    accent: theme.colors.accent,
    colorsTheme,
  };
}
