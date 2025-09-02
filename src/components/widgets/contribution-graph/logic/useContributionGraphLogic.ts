import { useMemo, useState, useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";
import { useWidgetState } from "../../../../context/WidgetStateContext";
import {
  ContributionData,
  ContributionGraphLogicProps,
} from "@/interfaces/charts";

const generateRandomCubeData = (): ContributionData[] => {
  const data: ContributionData[] = [];
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const randomValue = Math.floor(Math.random() * 101);

    data.push({
      date: d.toISOString().split("T")[0],
      value: randomValue,
    });
  }

  return data;
};

export const useContributionGraphLogic = ({
  title,
}: ContributionGraphLogicProps) => {
  const { colors } = useTheme();
  const { getCurrentCardData, getAggregatedData } = useWidgetState();
  const currentCardData = getCurrentCardData();
  const aggregatedData = getAggregatedData();

  const [cubeData, setCubeData] = useState<ContributionData[]>(() =>
    generateRandomCubeData()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCubeData(generateRandomCubeData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const chartTitle = useMemo(() => {
    return title || "Financial Activity Overview";
  }, [title]);

  const totalYearSpending = useMemo(() => {
    if (currentCardData && currentCardData.dailySpending?.yearly) {
      return currentCardData.dailySpending.yearly.reduce(
        (sum, day) => sum + day.total,
        0
      );
    } else {
      return aggregatedData.totalSpending;
    }
  }, [currentCardData, aggregatedData.totalSpending]);

  const averageDailySpending = useMemo(() => {
    return Math.round(totalYearSpending / 366);
  }, [totalYearSpending]);

  return {
    cubeData,
    chartTitle,
    totalYearSpending,
    averageDailySpending,
    colors,
  };
};
