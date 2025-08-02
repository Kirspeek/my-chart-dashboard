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
    <div className="w-full max-w-4xl">
      <ContributionHeader
        title={chartTitle}
        totalYearSpending={totalYearSpending}
        averageDailySpending={averageDailySpending}
        colors={colors}
      />

      <ContributionGrid
        weeks={weeks}
        monthPositions={monthPositions}
        getColorForValue={getColorForValue}
        colors={colors}
      />

      <ContributionLegend valueRanges={valueRanges} colors={colors} />
    </div>
  );
}
