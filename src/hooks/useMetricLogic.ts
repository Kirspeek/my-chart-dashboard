import { useMemo } from "react";
import { useTheme } from "./useTheme";
import type { MetricData } from "../../interfaces/widgets";

export function useMetricLogic(metric: MetricData, index: number = 0) {
  const { accent } = useTheme();

  const accentColor = useMemo(() => {
    // Assign different accent colors to each metric
    const accentColors = [
      accent.yellow, // First metric - yellow
      accent.teal, // Second metric - green/teal
      accent.red, // Third metric - red
      accent.blue, // Fourth metric - blue
    ];

    return accentColors[index % accentColors.length];
  }, [accent, index]);

  const displayValue = useMemo(() => {
    // For Total Sales, override value to 456.0
    if (metric.title.toLowerCase().includes("sales")) {
      return "456.0";
    }
    return metric.value;
  }, [metric.title, metric.value]);

  return {
    accentColor,
    displayValue,
  };
}
