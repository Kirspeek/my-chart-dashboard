"use client";

import { Header as UIHeader } from "../../../packages/ui-header/src";
import SunMoonToggle from "@/components/common/SunMoonToggle";
import { SearchProvider } from "@/context/SearchContext";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
// no local state needed

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <UIHeader 
            className="border-b border-[var(--widget-border)] w-full"
            style={{ borderRadius: 0, margin: 0 }}
            contentClassName="!max-w-none"
            defaultSection="dashboard"
            sections={[{ key: "dashboard", label: "Charts & Analytics Dashboard" }]}
            showThemeToggle
            themeToggleNode={<SunMoonToggle />}
            contactLinks={[
              {
                label: "Contact",
                href: "https://kirspeek.dev",
                target: "_blank",
                rel: "noopener noreferrer",
              },
            ]}
          />
          <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold primary-text mb-4">
                Appearance
              </h2>
              <div className="flex items-center gap-4 bg-[var(--widget-bg)] rounded-xl p-4">
                <button
                  onClick={toggleTheme}
                  className="widget-button px-3 py-1.5 rounded-full text-sm"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    background: "var(--button-bg)",
                    border: "2px solid var(--button-border)",
                    color: "var(--primary-text)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {isDark ? (
                    <Moon size={18} style={{ color: "var(--primary-text)" }} />
                  ) : (
                    <Sun size={18} style={{ color: "var(--primary-text)" }} />
                  )}
                  {isDark ? "Dark" : "Light"}
                </button>
                <span className="secondary-text">Toggle theme</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
