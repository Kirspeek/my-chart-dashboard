"use client";

import React, { useState, useEffect } from "react";
import { useContributionGraphLogic } from "@/hooks/contribution-graph/useContributionGraphLogic";
import { useContributionDataLogic } from "@/hooks/contribution-graph/useContributionDataLogic";
import ContributionHeader from "./ContributionHeader";
import HeatmapView from "./HeatmapView";
import TrendsView from "./TrendsView";
import AnalyticsView from "./AnalyticsView";
import InsightsView from "./InsightsView";
import { Calendar, BarChart3, TrendingUp, Eye, Clock } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ContributionGraphLogicProps as ContributionGraphProps } from "@/interfaces/charts";

type ViewMode = "heatmap" | "trends" | "analytics" | "insights";

export default function ContributionGraph({ title }: ContributionGraphProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>("heatmap");
  const [selectedDay, setSelectedDay] = useState<{
    date: string;
    value: number;
  } | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);

  const { colors } = useTheme();

  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setCurrentView((prev) => {
          const views: ViewMode[] = [
            "heatmap",
            "trends",
            "analytics",
            "insights",
          ];
          const currentIndex = views.indexOf(prev);
          return views[(currentIndex + 1) % views.length];
        });
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  const {
    cubeData,
    chartTitle,
    totalYearSpending,
    averageDailySpending,
    colors: chartColors,
  } = useContributionGraphLogic({ title });

  const { valueRanges, getColorForValue, weeks, monthPositions } =
    useContributionDataLogic(cubeData);

  const analytics = React.useMemo(() => {
    const allValues = cubeData
      .flat()
      .filter((v) => v.value > 0)
      .map((v) => v.value);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const avgValue =
      allValues.reduce((sum, val) => sum + val, 0) / allValues.length;

    const bestDay = cubeData.flat().findIndex((v) => v.value === maxValue);
    const worstDay = cubeData.flat().findIndex((v) => v.value === minValue);

    const recentWeeks = weeks.slice(-4);
    const olderWeeks = weeks.slice(0, -4);
    const recentAvg =
      recentWeeks.flat().reduce((sum, val) => sum + val.value, 0) /
      recentWeeks.flat().length;
    const olderAvg =
      olderWeeks.flat().reduce((sum, val) => sum + val.value, 0) /
      olderWeeks.flat().length;
    const trend = recentAvg > olderAvg ? "up" : "down";

    return {
      maxValue,
      minValue,
      avgValue,
      bestDay,
      worstDay,
      trend,
      trendPercentage: ((recentAvg - olderAvg) / olderAvg) * 100,
      totalDays: allValues.length,
      activeDays: allValues.filter((v) => v > avgValue).length,
    };
  }, [cubeData, weeks]);

  const renderViewMode = () => {
    switch (currentView) {
      case "heatmap":
        return (
          <HeatmapView
            isMobile={isMobile}
            weeks={weeks}
            monthPositions={monthPositions}
            getColorForValue={getColorForValue}
            colors={chartColors}
            valueRanges={valueRanges}
            selectedDay={selectedDay}
          />
        );

      case "trends":
        return (
          <TrendsView
            weeks={weeks}
            analytics={{
              maxValue: analytics.maxValue,
              totalDays: analytics.totalDays,
              avgValue: analytics.avgValue,
              activeDays: analytics.activeDays,
              trend: (analytics.trend === "up" ? "up" : "down") as
                | "up"
                | "down",
              trendPercentage: analytics.trendPercentage,
            }}
          />
        );

      case "analytics":
        return (
          <AnalyticsView
            analytics={{
              maxValue: analytics.maxValue,
              avgValue: analytics.avgValue,
              totalDays: analytics.totalDays,
              activeDays: analytics.activeDays,
              trend: (analytics.trend === "up" ? "up" : "down") as
                | "up"
                | "down",
              trendPercentage: analytics.trendPercentage,
            }}
            colors={
              chartColors as unknown as Parameters<
                typeof AnalyticsView
              >[0]["colors"]
            }
          />
        );

      case "insights":
        return (
          <InsightsView
            analytics={{
              maxValue: analytics.maxValue,
              avgValue: analytics.avgValue,
              totalDays: analytics.totalDays,
              activeDays: analytics.activeDays,
            }}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        );

      default:
        return null;
    }
  };

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
        colors={chartColors}
        isRealTime={isRealTime}
        setIsRealTime={setIsRealTime}
      />

      <div className="flex items-center justify-center space-x-1 mb-4">
        {[
          { key: "heatmap", icon: Calendar, label: "Heatmap" },
          { key: "trends", icon: TrendingUp, label: "Trends" },
          { key: "analytics", icon: BarChart3, label: "Analytics" },
          { key: "insights", icon: Eye, label: "Insights" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setCurrentView(key as ViewMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              currentView === key ? "scale-105" : ""
            }`}
            style={{
              background: currentView === key ? "#FFE9EF" : "var(--button-bg)",
              border: `1px solid ${currentView === key ? "#FC809F" : "var(--button-border)"}`,
              color: currentView === key ? "#FC809F" : colors.secondary,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            <Icon className="w-4 h-4" />
            {!isMobile && <span>{label}</span>}
          </button>
        ))}
      </div>

      {renderViewMode()}

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-3 h-3" style={{ color: colors.secondary }} />
          <span className="text-xs secondary-text">
            Daily activity levels (updates every 5 seconds)
          </span>
        </div>
      </div>
    </div>
  );
}
