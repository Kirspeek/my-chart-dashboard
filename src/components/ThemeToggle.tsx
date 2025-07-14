"use client";

import { Moon, Sun } from "lucide-react";
import { useColorMode } from "@chakra-ui/react";

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <button
      onClick={toggleColorMode}
      className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors duration-200"
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} theme`}
    >
      {colorMode === "light" ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Sun className="h-6 w-6" />
      )}
    </button>
  );
}
