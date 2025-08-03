"use client";

import {
  BarChart3,
  Users,
  Settings,
  Home,
  TrendingUp,
  PieChart,
  X as CloseIcon,
  Moon,
  Sun,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "#", icon: Home, current: true },
  { name: "Analytics", href: "#", icon: BarChart3, current: false },
  { name: "Users", href: "#", icon: Users, current: false },
  { name: "Reports", href: "#", icon: TrendingUp, current: false },
  { name: "Charts", href: "#", icon: PieChart, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
];

export default function Sidebar({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
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
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div
      className={`glass-panel fixed z-40 top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0 lg:h-auto`}
      style={{ borderRight: "2px solid rgba(0,0,0,0.06)" }}
    >
      {/* Close button (mobile only) */}
      <button
        className="absolute top-4 right-6 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
        onClick={onClose}
        aria-label="Close sidebar"
        type="button"
      >
        <CloseIcon className="h-6 w-6" />
      </button>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between flex-shrink-0 px-4 pr-16">
          <h2 className="sidebar-secondary">Dashboard</h2>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors duration-200"
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            {isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 rounded-md ${
                  item.current
                    ? "sidebar-active"
                    : "sidebar-secondary hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className={`mr-3 flex-shrink-0 sidebar-icon`} />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
