import { useMemo } from "react";
import { useTheme } from "./useTheme";

export function useChartLogic() {
  const { accent } = useTheme();

  const chartColors = useMemo(
    () => ({
      sales: accent.blue + "80",
      revenue: accent.teal + "80",
      profit: accent.yellow + "80",
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
      backgroundColor: "rgba(30, 30, 30, 0.9)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "0.75rem",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(8px)",
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
    }),
    []
  );

  const axisStyle = useMemo(
    () => ({
      stroke: "var(--secondary-text)",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
    }),
    []
  );

  const gridStyle = useMemo(
    () => ({
      stroke: "var(--button-border)",
      strokeDasharray: "2 4",
      strokeOpacity: 0.3,
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
