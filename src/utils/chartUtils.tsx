import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function getTrendIcon(trend: "up" | "down" | "stable") {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    case "down":
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    default:
      return <Minus className="w-3 h-3 text-gray-500" />;
  }
}
