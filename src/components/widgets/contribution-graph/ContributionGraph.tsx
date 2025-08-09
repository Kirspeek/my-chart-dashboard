"use client";

import React from "react";
import { useContributionGraphLogic, useContributionDataLogic } from "./logic";
import {
  ContributionHeader,
  ContributionGrid,
  ContributionLegend,
} from "./components";

interface ContributionGraphProps {
  title?: string;
}

export default function ContributionGraph({ title }: ContributionGraphProps) {
  // Detect mobile for layout changes
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

  // Use organized logic hooks
  const {
    cubeData,
    chartTitle,
    totalYearSpending,
    averageDailySpending,
    colors,
  } = useContributionGraphLogic({ title });

  const { valueRanges, getColorForValue, weeks, monthPositions } =
    useContributionDataLogic(cubeData);

  return (
    <div
      className="w-full max-w-4xl"
      style={{ width: isMobile ? "100%" : undefined }}
    >
      <style jsx>{`
        .x-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .x-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .mobile-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .mobile-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <ContributionHeader
        title={chartTitle}
        totalYearSpending={totalYearSpending}
        averageDailySpending={averageDailySpending}
        colors={colors}
      />

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
          />
        </div>
      </div>

      <ContributionLegend valueRanges={valueRanges} colors={colors} />
    </div>
  );
}
