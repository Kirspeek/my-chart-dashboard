"use client";

import React, { useMemo } from "react";
import SpendingChart from "../wheel/SpendingChart";
import { useWidgetState } from "../../../context/WidgetStateContext";
import { CardSpendingData } from "../../../../interfaces/wallet";
import { ExpenseData, TimePeriod } from "../../../../interfaces/widgets";

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

  return (
    <SpendingChart
      data={monthlyData}
      annualData={annualData}
      title="Monthly Spending"
      onClick={onClick}
      showCardNumber={true}
      cardNumber={currentCardData?.cardNumber || card.cardNumber}
    />
  );
}
