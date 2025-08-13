"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import FinancialBarChart from "../wallet-card/FinancialBarChart";
import { useWalletLogic } from "../../../hooks/wallet/useWalletLogic";
import { CardData } from "../../../../interfaces/wallet";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";
import { useWidgetState } from "../../../context/WidgetStateContext";

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

  return categories.map((category) => ({
    name: category.name,
    value: categoryTotals[category.name],
    color: category.color,
    percentage:
      total > 0 ? Math.round((categoryTotals[category.name] / total) * 100) : 0,
  }));
};

export default function AggregatedSpendingWidget({
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const { cards } = useWalletLogic();
  const { targetHeight } = useWidgetHeight();

  // Detect mobile to disable margin-top
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

  const { getCurrentCardData } = useWidgetState();
  const currentCardData = getCurrentCardData();

  const { spendingData, annualSpendingData } = useMemo(() => {
    if (currentCardData) {
      // Show data for current card
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

      return { spendingData: monthlyData, annualSpendingData: annualData };
    } else {
      // Show aggregated data for all cards
      const monthlyData = generateAggregatedExpenseData(cards);
      const annualData = generateAggregatedExpenseData(cards); // For now, use same data structure
      return { spendingData: monthlyData, annualSpendingData: annualData };
    }
  }, [currentCardData, cards]);

  // Calculate dynamic styling based on height
  const widgetStyle = useMemo(
    () => ({
      height: targetHeight,
      marginTop: isMobile ? 0 : "40px",
      transition: "height 0.3s ease-in-out", // Smooth transition for height changes
    }),
    [targetHeight, isMobile]
  );

  const contentStyle = useMemo(
    () => ({
      marginTop: isMobile ? 0 : "-40px",
      transition: "all 0.3s ease-in-out", // Smooth transition for content adjustments
    }),
    [isMobile]
  );

  return (
    <WidgetBase
      className="w-full h-full flex flex-col items-center justify-center p-6"
      style={widgetStyle}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <div
        className="w-full max-w-sm h-full flex flex-col"
        style={contentStyle}
      >
        <div className="flex-1">
          <FinancialBarChart
            data={spendingData}
            annualData={annualSpendingData}
            title="Total Spending"
            showCardNumber={!!currentCardData}
            cardNumber={currentCardData?.cardNumber}
          />
        </div>
      </div>
      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
