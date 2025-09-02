import React from "react";
import { TimePeriod } from "@/interfaces/widgets";
import PeriodSelector from "./PeriodSelector";
import RefreshButton from "./RefreshButton";

interface ChartHeaderProps {
  title?: string;
  subtitle?: string;
  showCardNumber?: boolean;
  cardNumber?: string;
  selectedPeriod?: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
  onRefresh?: () => void;
  showPeriodSelector?: boolean;
  showRefreshButton?: boolean;
  className?: string;
}

export default function ChartHeader({
  title,
  subtitle,
  showCardNumber = false,
  cardNumber,
  selectedPeriod,
  onPeriodChange,
  onRefresh,
  showPeriodSelector = false,
  showRefreshButton = false,
  className = "",
}: ChartHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-2 ${className}`}>
      <div className="flex flex-col">
        {title && <div className="text-lg font-mono primary-text">{title}</div>}
        {showCardNumber && (
          <div className="text-lg font-mono primary-text">
            {cardNumber || "**** ****"}
          </div>
        )}
        {subtitle && <div className="text-sm secondary-text">{subtitle}</div>}
      </div>

      <div className="flex items-center gap-2">
        {showPeriodSelector && selectedPeriod && onPeriodChange && (
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
          />
        )}
        {showRefreshButton && onRefresh && (
          <RefreshButton onRefresh={onRefresh} />
        )}
      </div>
    </div>
  );
}
