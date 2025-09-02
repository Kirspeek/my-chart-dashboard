"use client";

import React, { useMemo, useState } from "react";
import SpendingChart from "../wheel/SpendingChart";
import { useWidgetState } from "../../../context/WidgetStateContext";
import { CardSpendingData } from "@/interfaces/wallet";

import { RefreshCw, Eye, BarChart3 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useWheelExpenseData } from "./useWheelExpenseData";
import WheelCategorySelector from "./WheelCategorySelector";
import WheelInsightsPanel from "./WheelInsightsPanel";

interface MonthlyExpensesChartProps {
  card: CardSpendingData;
  onClick: () => void;
}

// generation moved to useWheelExpenseData

export default function MonthlyExpensesChart({
  card,
  onClick,
}: MonthlyExpensesChartProps) {
  const { getCurrentCardData } = useWidgetState();
  const { accent } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const currentCardData = getCurrentCardData();

  // Generate both monthly and annual data from current card's spending data
  const { monthlyData, annualData } = useWheelExpenseData(
    card,
    currentCardData
  );

  // Calculate insights
  const insights = useMemo(() => {
    const data = monthlyData;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const avg = total / data.length;
    const maxCategory = data.reduce(
      (max, item) => (item.value > max.value ? item : max),
      data[0]
    );
    const minCategory = data.reduce(
      (min, item) => (item.value < min.value ? item : min),
      data[0]
    );

    return {
      total,
      avg,
      maxCategory,
      minCategory,
      trend: Math.random() > 0.5 ? "up" : "down",
      trendPercentage: Math.floor(Math.random() * 15) + 1,
    };
  }, [monthlyData]);

  // Refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Chart Section - header and total are rendered inside SpendingChart via PayHeader */}
      <div className="flex-1 flex items-end relative">
        <div className="w-full h-full relative">
          <SpendingChart
            data={monthlyData}
            annualData={annualData}
            title="Monthly Spending"
            onClick={onClick}
            showCardNumber={true}
            cardNumber={currentCardData?.cardNumber || card.cardNumber}
            leftButtons={
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInsights(!showInsights);
                  }}
                  className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: showInsights
                      ? "var(--button-hover-bg)"
                      : "var(--button-bg)",
                    color: showInsights ? accent.blue : "var(--secondary-text)",
                  }}
                >
                  <Eye className="w-4 h-4" />
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
              </>
            }
          />

          {/* Category Selector - positioned lower near chart bottom */}
          <WheelCategorySelector
            data={monthlyData}
            selected={selectedCategory}
            onToggle={(name) =>
              setSelectedCategory(selectedCategory === name ? null : name)
            }
            className="absolute top-24 left-2 flex flex-col space-y-1"
          />
        </div>
      </div>

      {/* Bottom Panels - Match FinancialBarChart structure */}
      {showInsights && (
        <WheelInsightsPanel
          avg={insights.avg}
          maxCategory={insights.maxCategory}
        />
      )}

      {selectedCategory && (
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
              {selectedCategory} Analysis
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory(null);
              }}
              className="text-xs secondary-text hover:primary-text"
            >
              ×
            </button>
          </div>

          {(() => {
            const category = monthlyData.find(
              (c) => c.name === selectedCategory
            );
            if (!category) return null;

            return (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="secondary-text">Amount</span>
                  <span className="font-medium primary-text">
                    ${category.value.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="secondary-text">Percentage</span>
                  <span className="font-medium primary-text">
                    {category.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor:
                        accent[category.color as keyof typeof accent] ||
                        accent.blue,
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
