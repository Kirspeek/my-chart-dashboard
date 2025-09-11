import { useMemo } from "react";
import { CardSpendingData } from "@/interfaces/wallet";
import { ExpenseData, TimePeriod } from "@/interfaces/widgets";

const generateStableExpenseData = (
  cardId: string,
  period: TimePeriod
): ExpenseData[] => {
  let hash = 0;
  for (let i = 0; i < cardId.length; i++) {
    const char = cardId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  let seed = Math.abs(hash);

  const seededRandom = (min: number, max: number): number => {
    const x = Math.sin(seed++) * 10000;
    const random = x - Math.floor(x);
    return Math.floor(random * (max - min + 1)) + min;
  };

  const generatePercentages = (): number[] => {
    const categories = period === "Monthly" ? 4 : 5;
    const percentages: number[] = [];

    for (let i = 0; i < categories; i++) {
      percentages.push(seededRandom(8, 45));
    }

    const total = percentages.reduce((sum, val) => sum + val, 0);
    return percentages.map((p) => Math.round((p / total) * 100));
  };

  const percentages = generatePercentages();

  const categories = [
    { name: "Food", color: "yellow" },
    { name: "Transport", color: "blue" },
    { name: "Entertainment", color: "red" },
    { name: "Utilities", color: "teal" },
    { name: "Healthcare", color: "yellow" },
  ];

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

export const useWheelExpenseData = (
  card: CardSpendingData | null,
  currentCardData: {
    monthlySpending: { total: number; categories: Record<string, number> };
    dailySpending: {
      yearly: Array<{ total: number; categories: Record<string, number> }>;
    };
  } | null
) => {
  return useMemo(() => {
    if (currentCardData) {
      const { monthlySpending, dailySpending } = currentCardData;

      const monthlyTotal = monthlySpending.total;
      const monthlyCategories = [
        { name: "Food", color: "yellow" },
        { name: "Transport", color: "blue" },
        { name: "Entertainment", color: "red" },
        { name: "Utilities", color: "teal" },
      ];

      const monthlyData: ExpenseData[] = monthlyCategories.map((category) => {
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
          (sum, day) => sum + (day.categories.food || 0),
          0
        ),
        transport: dailySpending.yearly.reduce(
          (sum, day) => sum + (day.categories.transport || 0),
          0
        ),
        entertainment: dailySpending.yearly.reduce(
          (sum, day) => sum + (day.categories.entertainment || 0),
          0
        ),
        utilities: dailySpending.yearly.reduce(
          (sum, day) => sum + (day.categories.utilities || 0),
          0
        ),
      } as const;

      const annualData: ExpenseData[] = monthlyCategories.map((category) => {
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

    const monthlyData = generateStableExpenseData(
      card?.cardNumber || "default",
      "Monthly"
    );
    const annualData = generateStableExpenseData(
      card?.cardNumber || "default",
      "Annual"
    );
    return { monthlyData, annualData };
  }, [card?.cardNumber, currentCardData]);
};
