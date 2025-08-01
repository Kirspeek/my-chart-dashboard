"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import SpendingChart from "./SpendingChart";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface SpendingChartWidgetProps {
  data: ExpenseData[];
  title?: string;
  onClick?: () => void;
  showCardNumber?: boolean;
  cardNumber?: string;
}

export default function SpendingChartWidget({
  data,
  title,
  onClick,
  showCardNumber,
  cardNumber,
}: SpendingChartWidgetProps) {
  const { targetHeight } = useWidgetHeight();

  return (
    <WidgetBase
      className="flex flex-col"
      style={{
        height: targetHeight,
      }}
    >
      <SpendingChart
        data={data}
        title={title}
        onClick={onClick}
        showCardNumber={showCardNumber}
        cardNumber={cardNumber}
      />
    </WidgetBase>
  );
}
