import React from "react";
import { Target, Zap, ChevronRight, BarChart3 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { WheelInsightsPanelProps } from "@/interfaces/widgets";

export default function WheelInsightsPanel({
  avg,
  maxCategory,
}: WheelInsightsPanelProps) {
  const { accent } = useTheme();
  return (
    <div
      className="mt-4 p-3 rounded-lg"
      style={{
        background: "var(--button-bg)",
        border: "1px solid var(--button-border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold primary-text flex items-center">
          <BarChart3 className="w-4 h-4 mr-1" style={{ color: accent.blue }} />
          Spending Insights
        </span>
        <ChevronRight className="w-4 h-4 secondary-text" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs">
          <Target className="w-3 h-3" style={{ color: accent.yellow }} />
          <span className="secondary-text">
            Highest spending: {maxCategory.name}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Zap className="w-3 h-3" style={{ color: accent.teal }} />
          <span className="secondary-text">
            Average: ${Math.round(avg).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
