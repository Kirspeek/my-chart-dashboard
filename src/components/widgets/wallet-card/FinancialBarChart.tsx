"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "../../../hooks/useTheme";
import WaveAnimation from "./WaveAnimation";

interface FinancialBarChartProps {
  data: ExpenseData[];
  title?: string;
  onClick?: () => void;
  showCardNumber?: boolean;
  cardNumber?: string;
}

type TimePeriod = "Monthly" | "Annual";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export default function FinancialBarChart({
  data,
  title = "Spending Overview",
  onClick,
  showCardNumber = false,
  cardNumber,
}: FinancialBarChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Monthly");
  const [isAnimating, setIsAnimating] = useState(false);
  const { accent } = useTheme();

  // Trigger animation when data changes
  useEffect(() => {
    if (data.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 5000); // 5 seconds animation duration
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Process data with theme colors
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    return data.map((item) => ({
      ...item,
      color: accent[item.color as keyof typeof accent] || accent.blue,
    }));
  }, [data, accent]);

  const totalSpending = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return `$${total.toLocaleString()}`;
  }, [chartData]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Card Number and Period Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#232323] text-lg font-mono">
          {showCardNumber ? cardNumber || "**** ****" : "All Cards"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPeriod("Monthly");
            }}
            className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
            style={{
              fontFamily: "var(--font-sans)",
              color: selectedPeriod === "Monthly" ? "#232323" : "#888",
              backgroundColor:
                selectedPeriod === "Monthly"
                  ? "rgba(0,0,0,0.05)"
                  : "transparent",
            }}
          >
            Monthly
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPeriod("Annual");
            }}
            className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
            style={{
              fontFamily: "var(--font-sans)",
              color: selectedPeriod === "Annual" ? "#232323" : "#888",
              backgroundColor:
                selectedPeriod === "Annual"
                  ? "rgba(0,0,0,0.05)"
                  : "transparent",
            }}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Total Spending Display */}
      <div className="text-center mb-6">
        <div className="text-sm text-[#888] mb-1">{title}</div>
        <div className="text-2xl font-bold text-[#232323] font-mono">
          {totalSpending}
        </div>
      </div>

      {/* Wave Chart */}
      <div className="relative flex-1 mb-6 min-h-[12rem]">
        <WaveAnimation data={chartData} isAnimating={isAnimating} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-sans)",
                color: "#888",
              }}
            >
              {item.name} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
