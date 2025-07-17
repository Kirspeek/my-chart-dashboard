"use client";

import { useMemo } from "react";
import { useTheme } from "./useTheme";

export function useRadarChartLogic() {
  const { colors } = useTheme();

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: "var(--background)",
      border: `1px solid ${colors.borderSecondary}`,
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      color: colors.primary,
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
    }),
    [colors]
  );

  const formatTooltip = useMemo(
    () => (value: number, name: string) => [`${value}%`, name],
    []
  );

  return {
    tooltipStyle,
    formatTooltip,
  };
}
