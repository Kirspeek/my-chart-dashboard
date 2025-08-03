import React from "react";
import { TimePeriod } from "../../../../../interfaces/widgets";
import { ChartHeader } from "../../../common";

interface WheelHeaderProps {
  showCardNumber: boolean;
  cardNumber?: string;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export default function WheelHeader({
  showCardNumber,
  cardNumber,
  selectedPeriod,
  onPeriodChange,
}: WheelHeaderProps) {
  return (
    <ChartHeader
      showCardNumber={showCardNumber}
      cardNumber={cardNumber}
      selectedPeriod={selectedPeriod}
      onPeriodChange={onPeriodChange}
      showPeriodSelector={true}
    />
  );
}
