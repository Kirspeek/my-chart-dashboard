"use client";

import React, { useMemo, useState } from "react";
import SpendingChart from "../wheel/SpendingChart";
import { useWidgetState } from "../../../context/WidgetStateContext";
import { CardSpendingData } from "../../../../interfaces/wallet";
import { ExpenseData, TimePeriod } from "../../../../interfaces/widgets";
import {
  Target,
  Zap,
  ChevronRight,
  RefreshCw,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface MonthlyExpensesChartProps {
  card: CardSpendingData;
  onClick: () => void;
}

const generateStableExpenseData = (
  cardId: string,
  period: TimePeriod
): ExpenseData[] => {
  // Create a simple hash from card ID for consistent seeding
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    const char = cardId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use hash as seed for pseudo-random generation
  let seed = Math.abs(hash);

  // Simple seeded random number generator
  const seededRandom = (min: number, max: number): number => {
    const x = Math.sin(seed++) * 10000;
    const random = x - Math.floor(x);
    return Math.floor(random * (max - min + 1)) + min;
  };

  // Generate random percentages that sum to 100
  const generatePercentages = (): number[] => {
    const categories = period === "Monthly" ? 4 : 5;
    const percentages: number[] = [];

    // Generate random base values
    for (let i = 0; i < categories; i++) {
      percentages.push(seededRandom(8, 45));
    }

    // Normalize to sum to 100
    const total = percentages.reduce((sum, val) => sum + val, 0);
    return percentages.map((p) => Math.round((p / total) * 100));
  };

  const percentages = generatePercentages();

  // Category names and colors
  const categories = [
    { name: "Food", color: "yellow" },
    { name: "Transport", color: "blue" },
    { name: "Entertainment", color: "red" },
    { name: "Utilities", color: "teal" },
    { name: "Healthcare", color: "yellow" },
  ];

  // Generate total spending amount
  const baseAmount =
    period === "Monthly"
      ? seededRandom(8000, 15000)
      : seededRandom(100000, 200000);

  return percentages.map((percentage, index) => {
    const category = categories[index];
    const value = Math.round((baseAmount * percentage) / 100);

    return {
      name: category.name,
      value,
      color: category.color,
      percentage,
    };
  });
};

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
  const { monthlyData, annualData } = useMemo(() => {
    if (currentCardData) {
      const { monthlySpending, dailySpending } = currentCardData;

      // Monthly data
      const monthlyTotal = monthlySpending.total;
      const monthlyCategories = [
        { name: "Food", color: "yellow" },
        { name: "Transport", color: "blue" },
        { name: "Entertainment", color: "red" },
        { name: "Utilities", color: "teal" },
      ];

      const monthlyData = monthlyCategories.map((category) => {
        const value =
          monthlySpending.categories[
            category.name.toLowerCase() as keyof typeof monthlySpending.categories
          ] || 0;
        const percentage =
          monthlyTotal > 0 ? Math.round((value / monthlyTotal) * 100) : 0;

        return {
          name: category.name,
          value,
          color: category.color,
          percentage,
        };
      });

      // Annual data - aggregate from yearly daily spending
      const yearlyTotal = dailySpending.yearly.reduce(
        (sum, day) => sum + day.total,
        0
      );
      const yearlyCategories = {
        food: dailySpending.yearly.reduce(
          (sum, day) => sum + day.categories.food,
          0
        ),
        transport: dailySpending.yearly.reduce(
          (sum, day) => sum + day.categories.transport,
          0
        ),
        entertainment: dailySpending.yearly.reduce(
          (sum, day) => sum + day.categories.entertainment,
          0
        ),
        utilities: dailySpending.yearly.reduce(
          (sum, day) => sum + day.categories.utilities,
          0
        ),
      };

      const annualData = monthlyCategories.map((category) => {
        const value =
          yearlyCategories[
            category.name.toLowerCase() as keyof typeof yearlyCategories
          ] || 0;
        const percentage =
          yearlyTotal > 0 ? Math.round((value / yearlyTotal) * 100) : 0;

        return {
          name: category.name,
          value,
          color: category.color,
          percentage,
        };
      });

      return { monthlyData, annualData };
    }

    // Fallback to generated data if no current card data
    const fallbackMonthly = generateStableExpenseData(
      card.cardNumber || "default",
      "Monthly"
    );
    const fallbackAnnual = generateStableExpenseData(
      card.cardNumber || "default",
      "Annual"
    );
    return { monthlyData: fallbackMonthly, annualData: fallbackAnnual };
  }, [currentCardData, card.cardNumber]);

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
      {/* Header - Match FinancialBarChart structure */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-lg font-mono primary-text">
            {currentCardData?.cardNumber || card.cardNumber || "**** 8688"}
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInsights(!showInsights);
              }}
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${
                showInsights ? "bg-blue-100" : "bg-gray-100"
              }`}
              style={{
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
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 bg-gray-100 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              style={{ color: "var(--secondary-text)" }}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="text-xs font-medium transition-colors px-2 py-1 rounded"
            style={{
              backgroundColor: "var(--button-hover-bg)",
              color: "var(--primary-text)",
            }}
          >
            Monthly
          </button>
          <button
            className="text-xs font-medium transition-colors px-2 py-1 rounded"
            style={{
              backgroundColor: "transparent",
              color: "var(--secondary-text)",
            }}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Spending Display - Match FinancialBarChart structure */}
      <div className="text-center mb-4">
        <div className="text-sm secondary-text mb-1">Monthly Spending</div>
        <div className="text-2xl font-bold primary-text font-mono mb-2">
          ${insights.total.toLocaleString()}
        </div>

        {/* Trend Indicator - Match FinancialBarChart */}
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
            {insights.trendPercentage}% from last month
          </span>
        </div>
      </div>

      {/* Chart Section - Match FinancialBarChart structure */}
      <div className="flex-1 flex items-end relative">
        <div className="w-full h-full relative">
          <SpendingChart
            data={monthlyData}
            annualData={annualData}
            title="Monthly Spending"
            onClick={onClick}
            showCardNumber={false}
            cardNumber={currentCardData?.cardNumber || card.cardNumber}
            hideHeader={true}
          />

          {/* Category Selector - Match FinancialBarChart wave selector position */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {monthlyData.map((category) => (
              <button
                key={category.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  );
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
                  selectedCategory === category.name ? "ring-2 ring-white" : ""
                }`}
                style={{
                  backgroundColor:
                    accent[category.color as keyof typeof accent] ||
                    accent.blue,
                }}
                title={`${category.name} ${category.percentage}%`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panels - Match FinancialBarChart structure */}
      {showInsights && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold primary-text flex items-center">
              <BarChart3
                className="w-4 h-4 mr-1"
                style={{ color: accent.blue }}
              />
              Spending Insights
            </span>
            <ChevronRight className="w-4 h-4 secondary-text" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <Target className="w-3 h-3" style={{ color: accent.yellow }} />
              <span className="secondary-text">
                Highest spending: {insights.maxCategory.name}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Zap className="w-3 h-3" style={{ color: accent.teal }} />
              <span className="secondary-text">
                Average: ${Math.round(insights.avg).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
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
