"use client";

import React from "react";
import Header from "@/components/Header";
import { SearchProvider } from "@/context/SearchContext";
import type { AppShellProps } from "@/interfaces/pages";

export default function AppShell({ children }: AppShellProps) {
  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-6 py-8 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
