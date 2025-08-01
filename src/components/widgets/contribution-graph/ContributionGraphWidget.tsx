"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { useTheme } from "src/hooks/useTheme";

interface ContributionData {
  date: string;
  value: number; // Total daily spending across all categories
}

interface ContributionGraphWidgetProps {
  title?: string;
}

// Generate expense data for all cards for the entire year
const generateExpenseData = (): ContributionData[] => {
  const data: ContributionData[] = [];
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  // Annual expense categories with realistic totals
  const annualExpenses = {
    food: 12000, // $12,000/year on food
    transport: 8000, // $8,000/year on transport
    entertainment: 6000, // $6,000/year on entertainment
    utilities: 4000, // $4,000/year on utilities
  };

  // Calculate daily averages
  const daysInYear = 366; // 2024 is a leap year
  const dailyAverages = {
    food: annualExpenses.food / daysInYear,
    transport: annualExpenses.transport / daysInYear,
    entertainment: annualExpenses.entertainment / daysInYear,
    utilities: annualExpenses.utilities / daysInYear,
  };

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const month = d.getMonth();

    let totalDailySpending = 0;

    // Generate daily spending for each category and sum them together
    Object.entries(dailyAverages).forEach(([category, avgDaily]) => {
      let dailyValue = avgDaily;

      // Apply day-of-week variations
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend
        if (category === "food") dailyValue *= 1.5; // More eating out on weekends
        if (category === "entertainment") dailyValue *= 2.0; // More entertainment on weekends
        if (category === "transport") dailyValue *= 0.7; // Less commuting on weekends
      } else {
        // Weekday
        if (category === "transport") dailyValue *= 1.3; // More commuting on weekdays
        if (category === "food") dailyValue *= 0.9; // Less eating out on weekdays
      }

      // Apply monthly variations
      if (month === 11) {
        // December - holiday season
        if (category === "entertainment") dailyValue *= 2.5;
        if (category === "food") dailyValue *= 1.8;
        if (category === "transport") dailyValue *= 1.4;
      } else if (month === 6) {
        // July - summer
        if (category === "entertainment") dailyValue *= 1.6;
        if (category === "transport") dailyValue *= 1.2;
      } else if (month === 2) {
        // March - spring
        if (category === "transport") dailyValue *= 1.1;
      }

      // Add random variations (±30%)
      const variation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      dailyValue *= variation;

      // Add some special event days
      if (d.getDate() === 25 && month === 11) {
        // Christmas
        if (category === "entertainment") dailyValue *= 3.0;
        if (category === "food") dailyValue *= 2.5;
      } else if (d.getDate() === 1 && month === 0) {
        // New Year
        if (category === "entertainment") dailyValue *= 2.8;
        if (category === "food") dailyValue *= 2.0;
      }

      totalDailySpending += dailyValue;
    });

    data.push({
      date: d.toISOString().split("T")[0],
      value: Math.floor(totalDailySpending),
    });
  }

  return data;
};

export default function ContributionGraphWidget({
  title = "Financial Activity Overview",
}: ContributionGraphWidgetProps) {
  const { colors } = useTheme();

  // Generate data for all categories
  const allData = generateExpenseData();

  // Group data by date and sum all categories for daily total
  const dailyTotals = allData.reduce(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, value: 0 };
      }
      acc[item.date].value += item.value;
      return acc;
    },
    {} as Record<string, { date: string; value: number }>
  );

  const data = Object.values(dailyTotals);

  // Calculate value ranges based on actual data
  const allValues = data.map((d) => d.value);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue;

  // Define 5-color palette using all 5 rose colors
  const valueRanges = [
    { min: 0, max: 0, color: "#ebedf0", label: "No spending" },
    { min: 1, max: valueRange * 0.2, color: "#FFE9EF", label: "Very Low" },
    {
      min: valueRange * 0.2,
      max: valueRange * 0.4,
      color: "#FFC9D7",
      label: "Low",
    },
    {
      min: valueRange * 0.4,
      max: valueRange * 0.6,
      color: "#FFBCCD",
      label: "Medium-Low",
    },
    {
      min: valueRange * 0.6,
      max: valueRange * 0.8,
      color: "#FF9CB5",
      label: "Medium",
    },
    { min: valueRange * 0.8, max: valueRange, color: "#FC809F", label: "High" },
  ];

  // Get color for a value
  const getColorForValue = (value: number): string => {
    if (value === 0) return "#ebedf0";
    const range = valueRanges.find((r) => value >= r.min && value <= r.max);
    return range ? range.color : valueRanges[0].color;
  };

  // Group data by weeks
  const groupDataByWeeks = () => {
    const weeks: (typeof data)[] = [];

    // Create a map of all dates to their data
    const dateMap = new Map();
    data.forEach((item) => {
      dateMap.set(item.date, item);
    });

    // Generate exactly 366 days for 2024 (leap year)
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

    // Group by weeks starting from January 1st, 2024 (which was a Monday)
    let currentDate = new Date("2024-01-01"); // Monday, January 1st, 2024

    while (currentDate <= endDate) {
      const week: typeof data = [];

      // Add 7 days to the week
      for (let i = 0; i < 7 && currentDate <= endDate; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const dayData = dateMap.get(dateStr);

        if (dayData) {
          week.push(dayData);
        } else {
          // Add empty data for missing dates
          week.push({
            date: dateStr,
            value: 0,
          });
        }

        // Move to next day
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }

      weeks.push(week);
    }

    return weeks;
  };

  const weeks = groupDataByWeeks();

  // Calculate month positions based on actual calendar months
  const getMonthPositions = () => {
    const positions: { month: string; x: number }[] = [];

    // Cube dimensions and spacing
    const cubeSize = 12; // w-3 = 12px
    const cubeGap = 4; // gap-1 = 4px
    const totalWeekWidth = cubeSize + cubeGap; // 16px per week

    // Offset for day labels on the left
    const dayLabelOffset = 24 + 4; // w-6 (24px) + mr-1 (4px) = 28px

    // Calculate actual month boundaries
    const monthBoundaries = [
      { month: "Jan", startWeek: 0, endWeek: 4 }, // Jan 1-31 (5 weeks)
      { month: "Feb", startWeek: 5, endWeek: 8 }, // Feb 1-29 (4 weeks, leap year)
      { month: "Mar", startWeek: 9, endWeek: 13 }, // Mar 1-31 (5 weeks)
      { month: "Apr", startWeek: 14, endWeek: 17 }, // Apr 1-30 (4 weeks)
      { month: "May", startWeek: 18, endWeek: 22 }, // May 1-31 (5 weeks)
      { month: "Jun", startWeek: 23, endWeek: 26 }, // Jun 1-30 (4 weeks)
      { month: "Jul", startWeek: 27, endWeek: 31 }, // Jul 1-31 (5 weeks)
      { month: "Aug", startWeek: 32, endWeek: 35 }, // Aug 1-31 (4 weeks)
      { month: "Sep", startWeek: 36, endWeek: 39 }, // Sep 1-30 (4 weeks)
      { month: "Oct", startWeek: 40, endWeek: 44 }, // Oct 1-31 (5 weeks)
      { month: "Nov", startWeek: 45, endWeek: 48 }, // Nov 1-30 (4 weeks)
      { month: "Dec", startWeek: 49, endWeek: 52 }, // Dec 1-31 (4 weeks)
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
  };

  const monthPositions = getMonthPositions();

  // Calculate totals
  const totalYearSpending = data.reduce((sum, day) => sum + day.value, 0);
  const averageDailySpending = Math.round(totalYearSpending / data.length);

  return (
    <WidgetBase className="w-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-4">
          <h3
            className="text-lg font-semibold mb-2"
            style={{
              color: colors.primary,
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm mt-1"
            style={{
              color: colors.secondary,
              fontFamily: "var(--font-sans)",
              opacity: 0.8,
              letterSpacing: "0.01em",
            }}
          >
            Total: ${totalYearSpending.toLocaleString()} | Avg: $
            {averageDailySpending}/day
          </p>
        </div>

        {/* Contribution Graph */}
        <div className="relative">
          {/* Month Labels */}
          <div className="flex mb-4" style={{ marginLeft: "24px" }}>
            {monthPositions.map((pos, index) => (
              <div
                key={index}
                className="text-xs font-medium"
                style={{
                  position: "absolute",
                  left: `${pos.x}px`,
                  transform: "translateX(-50%)",
                  width: "56px",
                  textAlign: "center",
                  color: colors.secondary,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                }}
              >
                {pos.month}
              </div>
            ))}
          </div>

          {/* Graph Container */}
          <div className="flex">
            {/* Day Labels */}
            <div
              className="flex flex-col justify-between mr-2 text-xs font-medium"
              style={{
                height: "96px",
                color: colors.secondary,
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.01em",
              }}
            >
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: getColorForValue(day.value),
                        border: `1px solid ${getColorForValue(day.value)}`,
                        cursor: "pointer",
                      }}
                      title={`${day.date}: $${day.value.toLocaleString()} total`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div
              className="text-xs"
              style={{
                color: colors.secondary,
                fontFamily: "var(--font-sans)",
                opacity: 0.8,
                letterSpacing: "0.01em",
              }}
            >
              Daily spending across all expense categories
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{
                  color: colors.secondary,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                }}
              >
                Less
              </span>
              {valueRanges.map((range, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: range.color,
                    border: `1px solid ${range.color}`,
                  }}
                  title={`${range.label}`}
                />
              ))}
              <span
                className="text-xs"
                style={{
                  color: colors.secondary,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.01em",
                }}
              >
                More
              </span>
            </div>
          </div>
        </div>
      </div>
    </WidgetBase>
  );
}
