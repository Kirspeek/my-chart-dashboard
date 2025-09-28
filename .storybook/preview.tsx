import type { Preview } from "@storybook/nextjs";
import React from "react";
import "../src/styles/globals.css";
import "../src/styles/mobile.css";
import "../src/styles/mobile-grid.css";
import "../src/styles/weather.css";
import { TooltipProvider } from "../src/context/TooltipContext";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    backgrounds: { disable: true },
    themes: {
      default: "dark",
      list: [
        { name: "light", class: "light", color: "#ffffff" },
        { name: "dark", class: "dark", color: "#000000" },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: "Small mobile",
          styles: { width: "360px", height: "640px" },
        },
        mobile2: {
          name: "Large mobile",
          styles: { width: "414px", height: "896px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
      },
    },
  },
  decorators: [
    (Story, context) => {
      const selectedTheme = (context.globals as any).theme as
        | string
        | undefined;
      const saved =
        typeof window !== "undefined"
          ? (localStorage.getItem("theme") as "light" | "dark" | null)
          : null;
      const mode =
        (selectedTheme as "light" | "dark" | undefined) || saved || "dark";
      const isDark = mode === "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", isDark);
      }
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("theme", isDark ? "dark" : "light");
        }
      } catch {}
      return (
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      );
    },
  ],
};

export default preview;
