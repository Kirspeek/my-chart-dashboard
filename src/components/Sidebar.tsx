"use client";

import {
  BarChart3,
  Users,
  Settings,
  Home,
  TrendingUp,
  PieChart,
  X as CloseIcon,
  Box,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SunMoonToggle from "./common/SunMoonToggle";

const navigation = [
  { name: "Widgets", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Reports", href: "/reports", icon: TrendingUp },
  { name: "Charts", href: "/charts", icon: PieChart },
  { name: "3D models", href: "/models", icon: Box },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <div
      className={`glass-panel fixed z-40 top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0 lg:h-auto`}
      style={{ borderRight: "2px solid rgba(0,0,0,0.06)" }}
    >
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
          <h2 className="sidebar-secondary">Widgets</h2>
          <SunMoonToggle />
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center px-2 py-2 rounded-md ${
                  active
                    ? "sidebar-active"
                    : "sidebar-secondary hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className={`mr-3 flex-shrink-0 sidebar-icon`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
