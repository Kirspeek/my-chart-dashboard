import { useMemo } from "react";
import { ContributionData, ValueRange } from "../../../../../interfaces";
import { useTheme } from "../../../../hooks/useTheme";

export const useContributionDataLogic = (data: ContributionData[]) => {
  const { colorsTheme } = useTheme();
  const contributionGraphColors = colorsTheme.widgets.contributionGraph;

  const valueRanges = useMemo(
    (): ValueRange[] => [
      {
        min: 0,
        max: 0,
        color: contributionGraphColors.valueRanges.noActivity,
        label: "No activity",
      },
      {
        min: 1,
        max: 20,
        color: contributionGraphColors.valueRanges.veryLow,
        label: "Very Low",
      },
      {
        min: 21,
        max: 40,
        color: contributionGraphColors.valueRanges.low,
        label: "Low",
      },
      {
        min: 41,
        max: 60,
        color: contributionGraphColors.valueRanges.mediumLow,
        label: "Medium-Low",
      },
      {
        min: 61,
        max: 80,
        color: contributionGraphColors.valueRanges.medium,
        label: "Medium",
      },
      {
        min: 81,
        max: 100,
        color: contributionGraphColors.valueRanges.high,
        label: "High",
      },
    ],
    [contributionGraphColors.valueRanges]
  );

  const getColorForValue = (value: number): string => {
    if (value === 0) return contributionGraphColors.valueRanges.noActivity;
    const range = valueRanges.find((r) => value >= r.min && value <= r.max);
    return range ? range.color : valueRanges[0].color;
  };

  const groupDataByWeeks = useMemo(() => {
    const weeks: (typeof data)[] = [];

    const dateMap = new Map();
    data.forEach((item) => {
      dateMap.set(item.date, item);
    });

    const allDates: string[] = [];
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-12-31");

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      allDates.push(d.toISOString().split("T")[0]);
    }

    let currentDate = new Date("2024-01-01");

    while (currentDate <= endDate) {
      const week: typeof data = [];

      for (let i = 0; i < 7 && currentDate <= endDate; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const dayData = dateMap.get(dateStr);

        if (dayData) {
          week.push(dayData);
        } else {
          week.push({
            date: dateStr,
            value: 0,
          });
        }

        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }

      weeks.push(week);
    }

    return weeks;
  }, [data]);

  const getMonthPositions = useMemo(() => {
    const positions: { month: string; x: number }[] = [];

    const cubeSize = 12;
    const cubeGap = 4;
    const totalWeekWidth = cubeSize + cubeGap;

    const dayLabelOffset = 24 + 4;

    const monthBoundaries = [
      { month: "Jan", startWeek: 0, endWeek: 4 },
      { month: "Feb", startWeek: 5, endWeek: 8 },
      { month: "Mar", startWeek: 9, endWeek: 13 },
      { month: "Apr", startWeek: 14, endWeek: 17 },
      { month: "May", startWeek: 18, endWeek: 22 },
      { month: "Jun", startWeek: 23, endWeek: 26 },
      { month: "Jul", startWeek: 27, endWeek: 31 },
      { month: "Aug", startWeek: 32, endWeek: 35 },
      { month: "Sep", startWeek: 36, endWeek: 39 },
      { month: "Oct", startWeek: 40, endWeek: 44 },
      { month: "Nov", startWeek: 45, endWeek: 48 },
      { month: "Dec", startWeek: 49, endWeek: 52 },
    ];

    monthBoundaries.forEach(({ month, startWeek, endWeek }) => {
      const monthStartX = dayLabelOffset + startWeek * totalWeekWidth;
      const monthEndX = dayLabelOffset + endWeek * totalWeekWidth;
      const monthCenterX = monthStartX + (monthEndX - monthStartX) / 2;

      positions.push({
        month: month,
        x: monthCenterX,
      });
    });

    return positions;
  }, []);

  return {
    valueRanges,
    getColorForValue,
    weeks: groupDataByWeeks,
    monthPositions: getMonthPositions,
  };
};
