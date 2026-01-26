"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import FinancialBarChart from "./FinancialBarChart";
import { useWalletLogic } from "../../../hooks/wallet/useWalletLogic";
import { CardData } from "@/interfaces/wallet";
import { ExpenseData } from "@/interfaces/widgets";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";
import { useWidgetState } from "../../../context/WidgetStateContext";

const generateAggregatedExpenseData = (cards: CardData[]): ExpenseData[] => {
  if (cards.length === 0) {
    return [
      { name: "Food", value: 0, color: "yellow", percentage: 0 },
      { name: "Transport", value: 0, color: "blue", percentage: 0 },
      { name: "Entertainment", value: 0, color: "red", percentage: 0 },
      { name: "Utilities", value: 0, color: "teal", percentage: 0 },
    ];
  }

  const categoryTotals: { [key: string]: number } = {
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Utilities: 0,
  };

  cards.forEach((card) => {
    let hash = 0;
    for (let i = 0; i < card.number.length; i++) {
      const char = card.number.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    let seed = Math.abs(hash);

    const seededRandom = (min: number, max: number): number => {
      const x = Math.sin(seed++) * 10000;
      const random = x - Math.floor(x);
      return Math.floor(random * (max - min + 1)) + min;
    };

    const percentages = [
      seededRandom(20, 40),
      seededRandom(15, 35),
      seededRandom(10, 30),
      seededRandom(10, 25),
    ];

    const total = percentages.reduce((sum, val) => sum + val, 0);
    const normalizedPercentages = percentages.map((p) =>
      Math.round((p / total) * 100)
    );

    const baseAmount = seededRandom(8000, 15000);

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
      const { monthlySpending, dailySpending } = currentCardData;

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

  const widgetStyle = useMemo(
    () => ({
      height: targetHeight,
      marginTop: isMobile ? 0 : "40px",
      transition: "height 0.3s ease-in-out",
    }),
    [targetHeight, isMobile]
  );

  const contentStyle = useMemo(
    () => ({
      marginTop: isMobile ? 0 : "-40px",
      transition: "all 0.3s ease-in-out",
    }),
    [isMobile]
  );

  return (
    <WidgetBase
      className="aggregated-spending-widget w-full h-full flex flex-col items-center justify-center p-6"
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
