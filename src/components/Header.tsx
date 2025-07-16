"use client";

import { Bell, Search, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header
      className="glass-panel shadow-sm"
      style={{ borderBottom: "2px solid rgba(0,0,0,0.06)" }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1
              className="text-xl"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 900,
                color: "#232323",
                letterSpacing: "0.01em",
              }}
            >
              Chart Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <Search style={{ color: "#b0b0a8", width: 24, height: 24 }} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="search-mono-input w-full"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#232323",
                  background: "rgba(35,35,35,0.07)",
                  border: "2px solid #e0e0e0",
                  borderRadius: "1rem",
                  padding: "0.6rem 1.2rem 0.6rem 2.5rem",
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(35,35,35,0.04)",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              />
            </div>

            {/* Notifications */}
            <button className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <Bell style={{ color: "#b0b0a8", width: 28, height: 28 }} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    color: "#232323",
                    letterSpacing: "0.01em",
                  }}
                >
                  Admin User
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#b0b0a8",
                    letterSpacing: "0.01em",
                  }}
                >
                  admin@example.com
                </span>
              </div>
              <button className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
                <User style={{ color: "#b0b0a8", width: 28, height: 28 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
