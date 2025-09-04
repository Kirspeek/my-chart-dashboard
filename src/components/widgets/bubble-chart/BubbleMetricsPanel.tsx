"use client";

import React from "react";
import type { BubbleMetricsPanelProps } from "@/interfaces/charts";

export default function BubbleMetricsPanel({ stats }: BubbleMetricsPanelProps) {
  return (
    <div className="mb-6">
      <div
        className="backdrop-blur-sm rounded-xl border shadow-lg overflow-hidden"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-secondary)",
        }}
      >
        <div
          className="px-4 py-2 border-b"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--accent-color) 28%, transparent), color-mix(in srgb, var(--accent-color) 6%, transparent))",
            borderColor: "var(--border-secondary)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--primary-text)" }}
              >
                Metrics & Coordinates
              </span>
            </div>
            <div className="text-xs" style={{ color: "var(--secondary-text)" }}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-7 gap-2">
            <div
              className="rounded-lg p-2 border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-1.5 h-1.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div
                  className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    color:
                      "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
                  }}
                >
                  TOTAL
                </div>
              </div>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: "var(--primary-text)" }}
              >
                {stats.total}
              </div>
              <div
                className="text-xs font-medium"
                style={{ color: "var(--secondary-text)" }}
              >
                Data Points
              </div>
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((stats.total / 50) * 100, 100)}%`,
                    background: "var(--accent-color)",
                  }}
                ></div>
              </div>
            </div>

            <div
              className="rounded-lg p-2 border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-1.5 h-1.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div
                  className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    color:
                      "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
                  }}
                >
                  SIZE
                </div>
              </div>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: "var(--primary-text)" }}
              >
                {stats.avgSize}K
              </div>
              <div
                className="text-xs font-medium"
                style={{ color: "var(--secondary-text)" }}
              >
                Employees
              </div>
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((stats.avgSize / 100) * 100, 100)}%`,
                    background: "var(--accent-color)",
                  }}
                ></div>
              </div>
            </div>

            <div
              className="rounded-lg p-2 border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-1.5 h-1.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div
                  className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    color:
                      "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
                  }}
                >
                  GROWTH
                </div>
              </div>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: "var(--primary-text)" }}
              >
                {stats.avgGrowth}%
              </div>
              <div
                className="text-xs font-medium"
                style={{ color: "var(--secondary-text)" }}
              >
                Annual
              </div>
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((stats.avgGrowth / 70) * 100, 100)}%`,
                    background: "var(--accent-color)",
                  }}
                ></div>
              </div>
            </div>

            <div
              className="rounded-lg p-2 border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-1.5 h-1.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div
                  className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    color:
                      "color-mix(in srgb, var(--primary-text) 70%, var(--secondary-text))",
                  }}
                >
                  VALUE
                </div>
              </div>
              <div
                className="text-lg font-bold mb-1"
                style={{ color: "var(--primary-text)" }}
              >
                ${stats.avgMarketCap}B
              </div>
              <div
                className="text-xs font-medium"
                style={{ color: "var(--secondary-text)" }}
              >
                Market Cap
              </div>
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border-secondary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((stats.avgMarketCap / 2000) * 100, 100)}%`,
                    background: "var(--accent-color)",
                  }}
                ></div>
              </div>
            </div>

            {/* Axis boxes kept for layout consistency */}
            <div
              className="rounded-sm p-1 border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">X</span>
                </div>
                <div
                  className="text-[10px] font-bold px-1 py-0.5 rounded-sm"
                  style={{ color: "var(--secondary-text)" }}
                >
                  X-AXIS
                </div>
              </div>
              <div className="space-y-0.5">
                <div>
                  <div
                    className="text-[10px] font-bold"
                    style={{ color: "var(--primary-text)" }}
                  >
                    Market Cap
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "var(--secondary-text)" }}
                  >
                    0-3000B
                  </div>
                </div>
                <div
                  className="h-0.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border-secondary)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: "100%", background: "var(--accent-color)" }}
                  ></div>
                </div>
              </div>
            </div>

            <div
              className="rounded-sm p-1 border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">Y</span>
                </div>
                <div
                  className="text-[10px] font-bold px-1 py-0.5 rounded-sm"
                  style={{ color: "var(--secondary-text)" }}
                >
                  Y-AXIS
                </div>
              </div>
              <div className="space-y-0.5">
                <div>
                  <div
                    className="text-[10px] font-bold"
                    style={{ color: "var(--primary-text)" }}
                  >
                    Growth Rate
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "var(--secondary-text)" }}
                  >
                    0-70%
                  </div>
                </div>
                <div
                  className="h-0.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border-secondary)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: "70%", background: "var(--accent-color)" }}
                  ></div>
                </div>
              </div>
            </div>

            <div
              className="rounded-sm p-1 border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-secondary)",
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">Z</span>
                </div>
                <div
                  className="text-[10px] font-bold px-1 py-0.5 rounded-sm"
                  style={{ color: "var(--secondary-text)" }}
                >
                  Z-AXIS
                </div>
              </div>
              <div className="space-y-0.5">
                <div>
                  <div
                    className="text-[10px] font-bold"
                    style={{ color: "var(--primary-text)" }}
                  >
                    Depth
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "var(--secondary-text)" }}
                  >
                    0-100
                  </div>
                </div>
                <div
                  className="h-0.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border-secondary)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: "100%", background: "var(--accent-color)" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
