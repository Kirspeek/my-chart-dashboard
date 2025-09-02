import React from "react";
import ContributionGrid from "./ContributionGrid";
import ContributionLegend from "./ContributionLegend";
import { ContributionData } from "@/interfaces";
import { ContributionChartColors } from "@/types/contributionGraph";

export default function HeatmapView({
  isMobile,
  weeks,
  monthPositions,
  getColorForValue,
  colors,
  valueRanges,
  selectedDay,
}: {
  isMobile: boolean;
  weeks: ContributionData[][];
  monthPositions: { month: string; x: number }[];
  getColorForValue: (value: number) => string;
  colors: ContributionChartColors;
  valueRanges: Array<{
    min: number;
    max: number;
    color: string;
    label: string;
  }>;
  selectedDay: { date: string; value: number } | null;
}) {
  return (
    <div className="w-full">
      <div
        className="x-scroll w-full overflow-x-auto overflow-y-hidden flex justify-center"
        style={{
          overflowX: isMobile ? "hidden" : "auto",
          overflowY: isMobile ? "auto" : "hidden",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          className="min-w-[900px] max-w-[1200px] inline-block"
          style={{
            minWidth: isMobile ? "100%" : "900px",
            maxWidth: isMobile ? "100%" : "1200px",
            display: isMobile ? "block" : "inline-block",
          }}
        >
          <ContributionGrid
            weeks={weeks}
            monthPositions={monthPositions}
            getColorForValue={getColorForValue}
            colors={colors}
            isMobile={isMobile}
            selectedDay={selectedDay}
          />
        </div>
      </div>
      <ContributionLegend
        valueRanges={valueRanges}
        colors={{ secondary: colors.secondary }}
      />
    </div>
  );
}
