import { useCallback, useSyncExternalStore } from "react";
import { lightTheme, darkTheme } from "@/constants/theme";
import { getColorsTheme } from "@/theme/colorsTheme";

export function useTheme() {
  const getInitial = () => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return true;
  };

  type ThemeStore = {
    subscribe: (cb: () => void) => () => void;
    get: () => boolean;
    getServer: () => boolean;
    set: (next: boolean) => void;
    applySideEffects: (next: boolean) => void;
  };

  type ThemeGlobal = typeof globalThis & { __themeStore?: ThemeStore };

  const globalObj = (
    typeof window !== "undefined" ? window : globalThis
  ) as ThemeGlobal;
  if (!globalObj.__themeStore) {
    const listeners = new Set<() => void>();
    let isDarkStore = getInitial();

    const applySideEffects = (next: boolean) => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("theme", next ? "dark" : "light");
        }
      } catch {}
    };

    const set = (next: boolean) => {
      if (isDarkStore === next) return;
      isDarkStore = next;
      applySideEffects(isDarkStore);
      listeners.forEach((l) => l());
    };

    const subscribe = (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    };

    const get = () => isDarkStore;
    const getServer = () => true;

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key !== "theme") return;
        const saved = localStorage.getItem("theme");
        set(saved === "dark");
      });
    }

    globalObj.__themeStore = {
      subscribe,
      get,
      getServer,
      set,
      applySideEffects,
    };

    applySideEffects(isDarkStore);
  }

  const store = globalObj.__themeStore as ThemeStore;

  const isDark = useSyncExternalStore(
    store.subscribe,
    store.get,
    store.getServer
  );

  const toggleTheme = useCallback(() => {
    store.set(!isDark);
  }, [isDark, store]);

  const setTheme = useCallback(
    (mode: "dark" | "light") => {
      store.set(mode === "dark");
    },
    [store]
  );

  const theme = isDark ? darkTheme : lightTheme;
  const colorsTheme = getColorsTheme(isDark);

  return {
    isDark,
    theme,
    colors: theme.colors,
    accent: theme.colors.accent,
    colorsTheme,
    toggleTheme,
    setTheme,
  };
}
