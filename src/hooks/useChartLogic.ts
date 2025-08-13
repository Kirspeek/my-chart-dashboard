import { useMemo } from "react";
import { useTheme } from "./useTheme";

export function useChartLogic() {
  const { accent } = useTheme();

  const chartColors = useMemo(
    () => ({
      sales: accent.blue,
      revenue: accent.teal,
      profit: accent.yellow,
    }),
    [accent]
  );

  const formatValue = (value: number): string => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltip = (value: number, name: string): [string, string] => {
    return [
      `$${value.toLocaleString()}`,
      name.charAt(0).toUpperCase() + name.slice(1),
    ];
  };

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      border: "2px solid rgba(35, 35, 35, 0.1)",
      borderRadius: "1rem",
      boxShadow: "0 8px 32px rgba(35, 35, 35, 0.1)",
      backdropFilter: "blur(8px)",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
    }),
    []
  );

  const axisStyle = useMemo(
    () => ({
      stroke: "var(--secondary-text)",
      fontSize: 12,
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
    }),
    []
  );

  const gridStyle = useMemo(
    () => ({
      stroke: "var(--button-border)",
      strokeDasharray: "3 3",
    }),
    []
  );

  return {
    chartColors,
    formatValue,
    formatTooltip,
    tooltipStyle,
    axisStyle,
    gridStyle,
  };
}
