"use client";

import React from "react";
import { Monitor, Smartphone, Tablet, Laptop } from "lucide-react";
import type { DeviceUsageData } from "@/interfaces/widgets";
import { Card } from "@/components/common";

export default function DeviceUsageLegend({
  data,
  chartColors,
  isMobile,
}: {
  data: DeviceUsageData[];
  chartColors: string[];
  isMobile: boolean;
}) {
  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase();
    if (name.includes("mobile") || name.includes("phone"))
      return <Smartphone className="w-4 h-4" />;
    if (name.includes("tablet")) return <Tablet className="w-4 h-4" />;
    if (name.includes("laptop")) return <Laptop className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      {data.map((item, index) => (
        <Card
          key={index}
          variant="default"
          size="sm"
          hover
          className="flex items-center space-x-3 p-2"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-110 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${
                  chartColors[index % chartColors.length]
                }80, ${chartColors[index % chartColors.length]})`,
                border: `1px solid ${
                  chartColors[index % chartColors.length]
                }40`,
              }}
            />
            <div className="text-[var(--accent-color)] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              {getDeviceIcon(item.name)}
            </div>
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-medium primary-text group-hover:text-[var(--accent-color)] transition-colors duration-300"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: isMobile ? "0.6rem" : undefined,
              }}
            >
              {item.name}
            </span>
            <span
              className="text-xs secondary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              {Math.round((item.value / total) * 100)}%
            </span>
          </div>
        </Card>
      ))}
    </>
  );
}
