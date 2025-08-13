"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "../../../hooks/useTheme";
import WavesChart from "./WavesChart";
import { WaveData } from "./waves-logic";

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
  onClick,
  showCardNumber = false,
  cardNumber,
}: FinancialBarChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Monthly");
  const { accent } = useTheme();

  // Detect mobile for spacing adjustments
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        color: accent.teal,
        // Peak biased to the right
        path:
          chartData[0]?.color === accent.red
            ? // Taller single-crest red (rounded, centered)
              "M0,260 C140,230 200,160 280,85 S420,230 560,260 L560,260 L0,260 Z"
            : // Base variant (right-biased) — taller (smoothed right end)
              "M0,260 C80,230 140,210 200,220 C260,230 340,160 420,130 C500,120 540,200 555,235 S560,260 560,260 L0,260 Z",
      },
      {
        id: "dataset-2",
        color: accent.teal,
        // Peak biased to the left
        path:
          chartData[1]?.color === accent.red
            ? // Taller single-crest red (rounded, centered)
              "M0,260 C140,230 200,160 280,85 S420,230 560,260 L560,260 L0,260 Z"
            : // Base variant (left-biased) — taller
              "M0,260 C60,180 140,150 220,160 C300,175 360,220 420,200 C480,190 520,235 560,245 C545,255 552,258 560,260 L0,260 Z",
      },
      {
        id: "dataset-3",
        color: accent.teal,
        // Peak near center-left
        path:
          chartData[2]?.color === accent.red
            ? // Taller single-crest red (rounded, centered)
              "M0,260 C140,230 200,160 280,85 S420,230 560,260 L560,260 L0,260 Z"
            : // Base variant (center-left) — taller
              "M0,260 C70,220 150,200 230,190 C310,180 370,205 440,185 C500,175 540,220 520,232 C556,276 564,265 550,280 L0,260 Z",
      },
    ];
  }, [chartData, accent]);

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
      {/* Top Section - Card Number and Period Toggle */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: isMobile ? "2rem" : undefined,
          marginBottom: isMobile ? "1.5rem" : undefined,
        }}
      >
        <div className="text-lg font-mono primary-text">
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
                  ? "var(--button-hover-bg)"
                  : "transparent",
              color:
                selectedPeriod === "Monthly"
                  ? "var(--primary-text)"
                  : "var(--secondary-text)",
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
                selectedPeriod === "Annual"
                  ? "var(--button-hover-bg)"
                  : "transparent",
              color:
                selectedPeriod === "Annual"
                  ? "var(--primary-text)"
                  : "var(--secondary-text)",
            }}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Middle Section - Total Spending Display */}
      <div className="text-center mb-4">
        <div className="text-sm secondary-text mb-1">
          {selectedPeriod === "Monthly"
            ? "Monthly Spending"
            : "Annual Spending"}
        </div>
        <div className="text-2xl font-bold primary-text font-mono">
          {totalSpending}
        </div>
      </div>

      {/* Bottom Section - Waves Chart with negative margins to push to bottom */}
      <div
        className="flex-1 flex items-end"
        style={{
          marginBottom: "-20px",
          marginLeft: "-20px",
          marginRight: "-20px",
        }}
      >
        <WavesChart
          data={wavesChartData}
          title={`${selectedPeriod} Spending`}
        />
      </div>
    </div>
  );
}
