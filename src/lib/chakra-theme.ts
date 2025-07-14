"use client";

import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#f6f6f6",
    900: "#232323",
    accent: "#ffdd6d",
    teal: "#425b59",
    red: "#ea4300",
    blue: "#7bc2e8",
  },
  gray: {
    50: "#f6f6f6",
    100: "#e0e0e0",
    500: "#888",
    600: "#b0b0a8",
    900: "#232323",
  },
};

const radii = {
  xl: "2rem",
};

const theme = extendTheme({
  config,
  colors,
  radii,
  styles: {
    global: {
      body: {
        bg: "brand.50",
        color: "brand.900",
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
  },
});

export { theme };
