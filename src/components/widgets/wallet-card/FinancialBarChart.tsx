"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "../../../hooks/useTheme";
import WavesChart from "../waves-chart/WavesChart";
import { WaveData } from "../waves-chart/logic";

interface FinancialBarChartProps {
  data: ExpenseData[];
  annualData?: ExpenseData[];
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
  annualData,
  title = "Spending Overview",
  onClick,
  showCardNumber = false,
  cardNumber,
}: FinancialBarChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Monthly");
  const { accent } = useTheme();

  // Use the appropriate data based on selected period
  const chartData = useMemo(() => {
    const dataToUse =
      selectedPeriod === "Annual" && annualData ? annualData : data;

    if (dataToUse.length === 0) return [];

    return dataToUse.map((item) => ({
      ...item,
      color: accent[item.color as keyof typeof accent] || accent.blue,
    }));
  }, [data, annualData, selectedPeriod, accent]);

  // Convert expense data to waves chart format
  const wavesChartData = useMemo((): WaveData[] => {
    if (chartData.length === 0) return [];

    // Create waves chart datasets based on expense data
    return [
      {
        id: "dataset-1",
        color: chartData[0]?.color || "#50E3C2",
        path: "M0,260 C0,260 22,199 64,199 C105,199 112,144 154,144 C195,144 194,126 216,126 C237,126 263,184 314,184 C365,183 386,128 434,129 C483,130 511,240 560,260 L0,260 Z",
      },
      {
        id: "dataset-2",
        color: chartData[1]?.color || "#21A6EE",
        path: "M0,260 C35,254 63,124 88,124 C114,124 148,163 219,163 C290,163 315,100 359,100 C402,100 520,244 560,259 C560,259 0,259 0,260 Z",
      },
      {
        id: "dataset-3",
        color: chartData[2]?.color || "#807CCC",
        path: "M0,260 C0,260 4,252 7,252 C66,252 90,102 139,102 C188,102 205,135 252,135 C299,135 309,89 330,89 C350,89 366,122 404,122 C442,122 431,98 451,98 C470,98 499,213 560,260 L0,259 Z",
      },
    ];
  }, [chartData]);

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
              backgroundColor:
                selectedPeriod === "Monthly"
                  ? "rgba(0,0,0,0.1)"
                  : "transparent",
              color: selectedPeriod === "Monthly" ? "#232323" : "#666",
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
              backgroundColor:
                selectedPeriod === "Annual" ? "rgba(0,0,0,0.1)" : "transparent",
              color: selectedPeriod === "Annual" ? "#232323" : "#666",
            }}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Total Spending Display */}
      <div className="text-center mb-2">
        <div className="text-sm text-[#888] mb-1">{title}</div>
        <div className="text-2xl font-bold text-[#232323] font-mono">
          {totalSpending}
        </div>
      </div>

      {/* Waves Chart */}
      <div className="flex-1">
        <WavesChart
          data={wavesChartData}
          title={`${selectedPeriod} Spending`}
        />
      </div>
    </div>
  );
}
