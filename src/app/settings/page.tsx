"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SearchProvider } from "@/context/SearchContext";
import ThemeToggle from "@/components/examples/ThemeToggle";
import { useState } from "react";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold primary-text mb-4">
                Appearance
              </h2>
              <div className="flex items-center gap-4 bg-[var(--widget-bg)] rounded-xl p-4">
                <ThemeToggle />
                <span className="secondary-text">Toggle theme</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
