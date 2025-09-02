import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface WavesHeaderButtonsProps {
  showAlerts: boolean;
  isRefreshing: boolean;
  onToggleAlerts: (e: React.MouseEvent) => void;
  onRefresh: (e: React.MouseEvent) => void;
  alertActiveColor: string;
}

export default function WavesHeaderButtons({
  showAlerts,
  isRefreshing,
  onToggleAlerts,
  onRefresh,
  alertActiveColor,
}: WavesHeaderButtonsProps) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleAlerts(e);
        }}
        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: showAlerts
            ? "var(--button-hover-bg)"
            : "var(--button-bg)",
          color: showAlerts ? alertActiveColor : "var(--secondary-text)",
        }}
      >
        <AlertTriangle className="w-4 h-4" />
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
