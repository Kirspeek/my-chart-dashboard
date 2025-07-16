"use client";

import {
  BarChart3,
  Users,
  Settings,
  Home,
  TrendingUp,
  PieChart,
  X as CloseIcon,
} from "lucide-react";
import React from "react";

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
  return (
    <div
      className={`
        fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:h-auto
      `}
    >
      {/* Close button (mobile only) */}
      <button
        className="absolute top-4 right-4 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
        onClick={onClose}
        aria-label="Close sidebar"
        type="button"
      >
        <CloseIcon className="h-6 w-6" />
      </button>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h2>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    item.current
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                  }`}
                />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
