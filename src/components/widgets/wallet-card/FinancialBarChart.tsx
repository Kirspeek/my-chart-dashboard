"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "../../../hooks/useTheme";
import WavesChart from "./WavesChart";
import { WaveData } from "./waves-logic";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Activity,
  BarChart3,
  Target,
} from "lucide-react";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedWave, setSelectedWave] = useState<number | null>(null);
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

  // Calculate spending insights
  const insights = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const avg = total / chartData.length;
    const maxCategory = chartData.reduce(
      (max, item) => (item.value > max.value ? item : max),
      chartData[0]
    );
    const minCategory = chartData.reduce(
      (min, item) => (item.value < min.value ? item : min),
      chartData[0]
    );

    // Generate random alerts
    const alerts = [
      {
        type: "warning",
        message: "Food spending 15% above average",
        icon: AlertTriangle,
      },
      {
        type: "info",
        message: "Transport costs trending down",
        icon: TrendingDown,
      },
      { type: "success", message: "Utilities within budget", icon: Target },
    ];

    return {
      total,
      avg,
      maxCategory,
      minCategory,
      trend: Math.random() > 0.5 ? "up" : "down",
      trendPercentage: Math.floor(Math.random() * 20) + 1,
      alerts,
    };
  }, [chartData]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  // Refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Enhanced Top Section - Card Number and Period Toggle */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: isMobile ? "2rem" : undefined,
          marginBottom: isMobile ? "1.5rem" : undefined,
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="text-lg font-mono primary-text">
            {showCardNumber ? cardNumber || "**** ****" : "All Cards"}
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAlerts(!showAlerts);
              }}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: showAlerts
                  ? "var(--button-hover-bg)"
                  : "var(--button-bg)",
                color: showAlerts ? accent.red : "var(--secondary-text)",
              }}
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--secondary-text)",
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
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

      {/* Enhanced Middle Section - Total Spending Display */}
      <div className="text-center mb-4">
        <div className="text-sm secondary-text mb-1">
          {selectedPeriod === "Monthly"
            ? "Monthly Spending"
            : "Annual Spending"}
        </div>
        <div className="text-2xl font-bold primary-text font-mono mb-2">
          {totalSpending}
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center space-x-1 mb-3">
          {insights.trend === "up" ? (
            <TrendingUp className="w-4 h-4" style={{ color: accent.teal }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: accent.red }} />
          )}
          <span
            className="text-xs font-medium"
            style={{
              color: insights.trend === "up" ? accent.teal : accent.red,
            }}
          >
            {insights.trendPercentage}% from last {selectedPeriod.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Enhanced Bottom Section - Waves Chart with Wave Selector */}
      <div
        className="flex-1 flex items-end relative"
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

        {/* Wave Selector Overlay */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {wavesChartData.map((wave, index) => (
            <button
              key={wave.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWave(selectedWave === index ? null : index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
                selectedWave === index ? "ring-2 ring-white" : ""
              }`}
              style={{
                backgroundColor: wave.color,
              }}
              title={`Wave ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Spending Alerts Panel */}
      {showAlerts && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold primary-text flex items-center">
              <Activity
                className="w-4 h-4 mr-1"
                style={{ color: accent.blue }}
              />
              Spending Alerts
            </span>
            <ChevronRight className="w-4 h-4 secondary-text" />
          </div>

          <div className="space-y-2">
            {insights.alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <alert.icon
                  className="w-3 h-3"
                  style={{
                    color:
                      alert.type === "warning"
                        ? accent.red
                        : alert.type === "success"
                          ? accent.teal
                          : accent.blue,
                  }}
                />
                <span className="secondary-text">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wave Details Panel */}
      {selectedWave !== null && (
        <div
          className="mt-3 p-3 rounded-lg"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold primary-text flex items-center">
              <BarChart3
                className="w-4 h-4 mr-1"
                style={{ color: accent.teal }}
              />
              Wave {selectedWave + 1} Analysis
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWave(null);
              }}
              className="text-xs secondary-text hover:primary-text"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="secondary-text">Peak Value</span>
              <span className="font-medium primary-text">
                $
                {Math.round(
                  insights.total * (0.3 + selectedWave * 0.2)
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="secondary-text">Trend</span>
              <span
                className="font-medium primary-text"
                style={{ color: accent.teal }}
              >
                {selectedWave === 0
                  ? "Rising"
                  : selectedWave === 1
                    ? "Stable"
                    : "Declining"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${60 + selectedWave * 15}%`,
                  backgroundColor: accent.teal,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
