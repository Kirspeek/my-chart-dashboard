import React from "react";
import { Zap, Award } from "lucide-react";
import { AnalyticsViewAnalytics } from "@/types/contributionGraph";

export default function AnalyticsView({
  analytics,
}: {
  analytics: AnalyticsViewAnalytics;
  colors: {
    primary: string;
    secondary: string;
    muted: string;
    cardBackground: string;
    borderSecondary: string;
  } & {
    accent: { blue: string; yellow: string; red: string; teal: string };
  };
}) {
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
            <Zap className="w-4 h-4 mr-2" style={{ color: "#FF9CB5" }} />
            Performance Insights
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs secondary-text">Best Performance</span>
              <span className="text-xs font-bold primary-text">
                ${analytics.maxValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs secondary-text">Consistency Score</span>
              <span className="text-xs font-bold primary-text">
                {Math.round((analytics.activeDays / analytics.totalDays) * 100)}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs secondary-text">Growth Rate</span>
              <span
                className="text-xs font-bold"
                style={{
                  color: analytics.trend === "up" ? "#FC809F" : "#FFC9D7",
                }}
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
            <Award className="w-4 h-4 mr-2" style={{ color: "#FFBCCD" }} />
            Activity Patterns
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs secondary-text">Total Transactions</span>
              <span className="text-xs font-bold primary-text">
                {analytics.totalDays}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs secondary-text">High Activity Days</span>
              <span className="text-xs font-bold primary-text">
                {analytics.activeDays}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs secondary-text">Efficiency Ratio</span>
              <span className="text-xs font-bold primary-text">
                {Math.round((analytics.avgValue / analytics.maxValue) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
