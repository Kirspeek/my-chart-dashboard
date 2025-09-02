import React from "react";
import { Eye, RefreshCw } from "lucide-react";

export default function WheelHeaderButtons({
  showInsights,
  isRefreshing,
  onToggleInsights,
  onRefresh,
  accentColor,
}: {
  showInsights: boolean;
  isRefreshing: boolean;
  onToggleInsights: (e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
  accentColor: string;
}) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleInsights(e);
        }}
        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: showInsights
            ? "var(--button-hover-bg)"
            : "var(--button-bg)",
          color: showInsights ? accentColor : "var(--secondary-text)",
        }}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRefresh(e);
        }}
        className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${
          isRefreshing ? "animate-spin" : ""
        }`}
        style={{
          backgroundColor: "var(--button-bg)",
          color: "var(--secondary-text)",
        }}
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </>
  );
}
