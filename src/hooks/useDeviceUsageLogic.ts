"use client";

import { useMemo } from "react";
import { useTheme } from "./useTheme";

export function useDeviceUsageLogic() {
  const { colors } = useTheme();

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: "var(--background)",
      border: `1px solid ${colors.borderSecondary}`,
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      color: colors.primary,
    }),
    [colors]
  );

  const formatTooltip = useMemo<
    (value: number, name: string) => [string, string]
  >(() => {
    return (value: number, name: string) =>
      [`${value}%`, name] as [string, string];
  }, []);

  const getChartColors = useMemo(() => {
    return [
      colors.accent.blue,
      colors.accent.teal,
      colors.accent.yellow,
      colors.accent.red,
    ];
  }, [colors.accent]);

  return {
    tooltipStyle,
    formatTooltip,
    getChartColors,
  };
}
