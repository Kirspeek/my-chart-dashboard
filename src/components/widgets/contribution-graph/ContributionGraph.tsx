"use client";

import React, { useState, useEffect } from "react";
import { useContributionGraphLogic, useContributionDataLogic } from "./logic";
import {
  ContributionHeader,
  ContributionGrid,
  ContributionLegend,
} from "./components";
import {
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  Eye,
  MousePointer,
  Sparkles,
  Zap,
  Award,
  Clock,
} from "lucide-react";
import { useTheme } from "src/hooks/useTheme";

interface ContributionGraphProps {
  title?: string;
}

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

  // Auto-rotate views for demonstration
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
      }, 15000); // Change view every 15 seconds
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  // Use organized logic hooks
  const {
    cubeData,
    chartTitle,
    totalYearSpending,
    averageDailySpending,
    colors: chartColors,
  } = useContributionGraphLogic({ title });

  const { valueRanges, getColorForValue, weeks, monthPositions } =
    useContributionDataLogic(cubeData);

  // Calculate advanced analytics
  const analytics = React.useMemo(() => {
    const allValues = cubeData
      .flat()
      .filter((v) => v.value > 0)
      .map((v) => v.value);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const avgValue =
      allValues.reduce((sum, val) => sum + val, 0) / allValues.length;

    // Find best and worst days
    const bestDay = cubeData.flat().findIndex((v) => v.value === maxValue);
    const worstDay = cubeData.flat().findIndex((v) => v.value === minValue);

    // Calculate trends
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
                  colors={chartColors}
                  isMobile={isMobile}
                  selectedDay={selectedDay}
                />
              </div>
            </div>
            <ContributionLegend
              valueRanges={valueRanges}
              colors={chartColors}
            />
          </div>
        );

      case "trends":
        return (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Peak Day",
                  value: `$${analytics.maxValue.toLocaleString()}`,
                  icon: TrendingUp,
                  color: "#FC809F", // High activity rose
                },
                {
                  label: "Avg Daily",
                  value: `$${Math.round(analytics.avgValue).toLocaleString()}`,
                  icon: Activity,
                  color: "#FF9CB5", // Medium activity rose
                },
                {
                  label: "Active Days",
                  value: analytics.activeDays.toString(),
                  icon: Calendar,
                  color: "#FFBCCD", // Medium-Low activity rose
                },
                {
                  label: "Trend",
                  value: `${analytics.trendPercentage > 0 ? "+" : ""}${analytics.trendPercentage.toFixed(1)}%`,
                  icon: BarChart3,
                  color: analytics.trend === "up" ? "#FC809F" : "#FFC9D7", // High activity rose for up, Low for down
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg text-center group hover:scale-105 transition-all duration-300"
                  style={{
                    background: "var(--button-bg)",
                    border: "1px solid var(--button-border)",
                  }}
                >
                  <item.icon
                    className="w-5 h-5 mx-auto mb-2"
                    style={{ color: item.color }}
                  />
                  <div
                    className="text-sm font-bold primary-text"
                    style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs secondary-text">{item.label}</div>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                background: "var(--button-bg)",
                border: "1px solid var(--button-border)",
              }}
            >
              <div
                className="text-sm font-bold primary-text mb-2"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                Weekly Activity Trends
              </div>
              <div className="space-y-2">
                {weeks.slice(-8).map((week, index) => {
                  const weekTotal = week.reduce(
                    (sum, val) => sum + val.value,
                    0
                  );
                  const weekAvg = weekTotal / week.length;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs secondary-text">
                        Week {weeks.length - 7 + index}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(weekAvg / analytics.maxValue) * 100}%`,
                              background:
                                weekAvg > analytics.avgValue
                                  ? "#FC809F" // High activity rose
                                  : "#FF9CB5", // Medium activity rose
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold primary-text">
                          ${Math.round(weekAvg).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg"
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--button-border)",
                }}
              >
                <div
                  className="text-sm font-bold primary-text mb-3 flex items-center"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  <Zap
                    className="w-4 h-4 mr-2"
                    style={{ color: "#FF9CB5" }} // Medium activity rose
                  />
                  Performance Insights
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs secondary-text">
                      Best Performance
                    </span>
                    <span className="text-xs font-bold primary-text">
                      ${analytics.maxValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs secondary-text">
                      Consistency Score
                    </span>
                    <span className="text-xs font-bold primary-text">
                      {Math.round(
                        (analytics.activeDays / analytics.totalDays) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs secondary-text">Growth Rate</span>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: analytics.trend === "up" ? "#FC809F" : "#FFC9D7",
                      }} // High activity rose for up, Low for down
                    >
                      {analytics.trendPercentage > 0 ? "+" : ""}
                      {analytics.trendPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--button-border)",
                }}
              >
                <div
                  className="text-sm font-bold primary-text mb-3 flex items-center"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  <Award
                    className="w-4 h-4 mr-2"
                    style={{ color: "#FFBCCD" }} // Medium-Low activity rose
                  />
                  Activity Patterns
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs secondary-text">
                      Total Transactions
                    </span>
                    <span className="text-xs font-bold primary-text">
                      {analytics.totalDays}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs secondary-text">
                      High Activity Days
                    </span>
                    <span className="text-xs font-bold primary-text">
                      {analytics.activeDays}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs secondary-text">
                      Efficiency Ratio
                    </span>
                    <span className="text-xs font-bold primary-text">
                      {Math.round(
                        (analytics.avgValue / analytics.maxValue) * 100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "insights":
        return (
          <div className="w-full space-y-4">
            <div
              className="p-4 rounded-lg"
              style={{
                background: "var(--button-bg)",
                border: "1px solid var(--button-border)",
              }}
            >
              <div
                className="text-sm font-bold primary-text mb-3 flex items-center"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                <Sparkles
                  className="w-4 h-4 mr-2"
                  style={{ color: "#FF9CB5" }} // Medium activity rose
                />
                Smart Recommendations
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: "#FC809F" }} // High activity rose
                  />
                  <span className="text-xs secondary-text">
                    <strong>Peak Performance:</strong> Your best day was $
                    {analytics.maxValue.toLocaleString()}. Consider replicating
                    those conditions.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: "#FF9CB5" }} // Medium activity rose
                  />
                  <span className="text-xs secondary-text">
                    <strong>Trend Analysis:</strong>{" "}
                    {analytics.trend === "up" ? "Positive" : "Negative"} trend
                    detected.{" "}
                    {analytics.trend === "up"
                      ? "Maintain momentum"
                      : "Focus on improvement"}
                    .
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: "#FFBCCD" }} // Medium-Low activity rose
                  />
                  <span className="text-xs secondary-text">
                    <strong>Consistency:</strong> {analytics.activeDays} out of{" "}
                    {analytics.totalDays} days show above-average activity.
                  </span>
                </div>
              </div>
            </div>

            {selectedDay && (
              <div
                className="p-4 rounded-lg"
                style={{
                  background: "var(--button-bg)",
                  border: "1px solid var(--button-border)",
                }}
              >
                <div
                  className="text-sm font-bold primary-text mb-2 flex items-center"
                  style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}
                >
                  <MousePointer
                    className="w-4 h-4 mr-2"
                    style={{ color: "#FF9CB5" }} // Medium activity rose
                  />
                  Selected Day: {selectedDay.date}
                </div>
                <div className="text-lg font-bold primary-text">
                  ${selectedDay.value.toLocaleString()}
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-xs px-2 py-1 rounded-full mt-2"
                  style={{
                    background: "#FFC9D7" + "20", // Low activity rose with opacity
                    color: "#FFC9D7", // Low activity rose
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
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

      {/* View Mode Navigation */}
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
              background:
                currentView === key
                  ? "#FFE9EF" // Very light rose from chart
                  : "var(--button-bg)",
              border: `1px solid ${currentView === key ? "#FC809F" : "var(--button-border)"}`, // High activity rose from chart
              color: currentView === key ? "#FC809F" : colors.secondary, // High activity rose text
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            <Icon className="w-4 h-4" />
            {!isMobile && <span>{label}</span>}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {renderViewMode()}

      {/* Footer */}
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
