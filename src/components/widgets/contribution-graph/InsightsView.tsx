import React from "react";
import { Sparkles, MousePointer } from "lucide-react";

export default function InsightsView({
  analytics,
  selectedDay,
  setSelectedDay,
}: {
  analytics: {
    maxValue: number;
    avgValue: number;
    totalDays: number;
    activeDays: number;
  };
  selectedDay: { date: string; value: number } | null;
  setSelectedDay: (val: { date: string; value: number } | null) => void;
}) {
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
          <Sparkles className="w-4 h-4 mr-2" style={{ color: "#FF9CB5" }} />
          Smart Recommendations
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <div
              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: "#FC809F" }}
            />
            <span className="text-xs secondary-text">
              <strong>Peak Performance:</strong> Your best day was $
              {analytics.maxValue.toLocaleString()}. Consider replicating those
              conditions.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <div
              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ background: "#FF9CB5" }}
            />
            <span className="text-xs secondary-text">
              <strong>Trend Analysis:</strong>{" "}
              {analytics.avgValue >= analytics.maxValue * 0.5
                ? "Positive"
                : "Neutral"}{" "}
              trend detected.
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
              style={{ color: "#FF9CB5" }}
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
              background: "#FFC9D7" + "20",
              color: "#FFC9D7",
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
}
