"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import FinancialBarChart from "../wallet-card/FinancialBarChart";
import { useWalletLogic } from "../../../hooks/wallet/useWalletLogic";
import { CardData } from "../../../../interfaces/wallet";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// Generate aggregated expense data from all cards
const generateAggregatedExpenseData = (cards: CardData[]): ExpenseData[] => {
  if (cards.length === 0) {
    return [
      { name: "Food", value: 0, color: "yellow", percentage: 0 },
      { name: "Transport", value: 0, color: "blue", percentage: 0 },
      { name: "Entertainment", value: 0, color: "red", percentage: 0 },
      { name: "Utilities", value: 0, color: "teal", percentage: 0 },
    ];
  }

  // Aggregate spending across all cards by generating mock data for each card
  const categoryTotals: { [key: string]: number } = {
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Utilities: 0,
  };

  // Generate mock data for each card and aggregate
  cards.forEach((card) => {
    // Create a simple hash from card ID for consistent seeding
    let hash = 0;
    for (let i = 0; i < card.number.length; i++) {
      const char = card.number.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    let seed = Math.abs(hash);

    // Simple seeded random number generator
    const seededRandom = (min: number, max: number): number => {
      const x = Math.sin(seed++) * 10000;
      const random = x - Math.floor(x);
      return Math.floor(random * (max - min + 1)) + min;
    };

    // Generate random percentages that sum to 100
    const percentages = [
      seededRandom(20, 40), // Food
      seededRandom(15, 35), // Transport
      seededRandom(10, 30), // Entertainment
      seededRandom(10, 25), // Utilities
    ];

    // Normalize to sum to 100
    const total = percentages.reduce((sum, val) => sum + val, 0);
    const normalizedPercentages = percentages.map((p) =>
      Math.round((p / total) * 100)
    );

    // Generate total spending amount for this card
    const baseAmount = seededRandom(8000, 15000);

    // Add to category totals
    categoryTotals.Food += Math.round(
      (baseAmount * normalizedPercentages[0]) / 100
    );
    categoryTotals.Transport += Math.round(
      (baseAmount * normalizedPercentages[1]) / 100
    );
    categoryTotals.Entertainment += Math.round(
      (baseAmount * normalizedPercentages[2]) / 100
    );
    categoryTotals.Utilities += Math.round(
      (baseAmount * normalizedPercentages[3]) / 100
    );
  });

  // Calculate total and percentages
  const total = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  const categories = [
    { name: "Food", color: "yellow" },
    { name: "Transport", color: "blue" },
    { name: "Entertainment", color: "red" },
    { name: "Utilities", color: "teal" },
  ];

  return categories.map((category) => {
    const value = categoryTotals[category.name];
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return {
      name: category.name,
      value,
      color: category.color,
      percentage,
    };
  });
};

export default function AggregatedSpendingWidget() {
  const { cards } = useWalletLogic();
  const { targetHeight } = useWidgetHeight();

  const aggregatedData = useMemo(() => {
    return generateAggregatedExpenseData(cards);
  }, [cards]);

  // Calculate dynamic styling based on height
  const widgetStyle = useMemo(
    () => ({
      height: targetHeight,
      marginTop: "40px",
      transition: "height 0.3s ease-in-out", // Smooth transition for height changes
    }),
    [targetHeight]
  );

  const contentStyle = useMemo(
    () => ({
      marginTop: "-40px",
      transition: "all 0.3s ease-in-out", // Smooth transition for content adjustments
    }),
    []
  );

  return (
    <WidgetBase
      className="w-full h-full flex flex-col items-center justify-center p-6"
      style={widgetStyle}
    >
      <div
        className="w-full max-w-sm h-full flex flex-col"
        style={contentStyle}
      >
        <div className="flex-1">
          <FinancialBarChart
            data={aggregatedData}
            title="Total Spending"
            showCardNumber={false}
          />
        </div>
      </div>
    </WidgetBase>
  );
}
