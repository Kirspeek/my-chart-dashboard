import React from "react";
import { Calendar, BarChart3, TrendingUp, Activity } from "lucide-react";
import { TrendsViewAnalytics } from "@/types/contributionGraph";

export default function TrendsView({
  weeks,
  analytics,
}: {
  weeks: Array<Array<{ date: string; value: number }>>;
  analytics: TrendsViewAnalytics;
}) {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Peak Day",
            value: `$${analytics.maxValue.toLocaleString()}`,
            icon: TrendingUp,
            color: "#FC809F",
          },
          {
            label: "Avg Daily",
            value: `$${Math.round(analytics.avgValue).toLocaleString()}`,
            icon: Activity,
            color: "#FF9CB5",
          },
          {
            label: "Active Days",
            value: analytics.activeDays.toString(),
            icon: Calendar,
            color: "#FFBCCD",
          },
          {
            label: "Trend",
            value: `${analytics.trendPercentage > 0 ? "+" : ""}${analytics.trendPercentage.toFixed(1)}%`,
            icon: BarChart3,
            color: analytics.trend === "up" ? "#FC809F" : "#FFC9D7",
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
            const weekTotal = week.reduce((sum, val) => sum + val.value, 0);
            const weekAvg = weekTotal / week.length;
            return (
              <div key={index} className="flex items-center justify-between">
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
                          weekAvg > analytics.avgValue ? "#FC809F" : "#FF9CB5",
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
}
