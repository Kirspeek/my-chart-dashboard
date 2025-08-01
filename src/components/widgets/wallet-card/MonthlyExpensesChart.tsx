"use client";

import React, { useMemo } from "react";
import SpendingChart from "./SpendingChart";

interface MonthlyExpensesChartProps {
  card: CardData;
  onClick: () => void;
}

type TimePeriod = "Monthly" | "Annual";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface CardData {
  number: string;
  name: string;
  exp: string;
  ccv: string;
  bank?: string;
  scheme?: string;
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
  // Generate stable expense data based on card ID
  const monthlyData = useMemo(() => {
    return generateStableExpenseData(card.number || "default", "Monthly");
  }, [card.number]);

  return (
    <SpendingChart
      data={monthlyData}
      title="Monthly Spending"
      onClick={onClick}
      showCardNumber={true}
      cardNumber={card.number}
    />
  );
}
