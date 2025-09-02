import { useState, useMemo } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { ExpenseData, TimePeriod } from "@/interfaces/widgets";

export const useWheelChartLogic = (
  data: ExpenseData[],
  annualData?: ExpenseData[]
) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Monthly");
  const { accent } = useTheme();

  const currentData = useMemo(() => {
    const dataToUse =
      selectedPeriod === "Annual" && annualData ? annualData : data;

    if (dataToUse.length > 0) {
      return dataToUse.map((item) => ({
        ...item,
        color: accent[item.color as keyof typeof accent] || accent.blue,
      }));
    }
    return [];
  }, [data, annualData, selectedPeriod, accent]);

  const totalSpending = useMemo(() => {
    const total = currentData.reduce((sum, item) => sum + item.value, 0);
    return `$${total.toLocaleString()}`;
  }, [currentData]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    currentData,
    totalSpending,
  };
};
