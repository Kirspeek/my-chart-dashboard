"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import FinancialBarChart from "./FinancialBarChart";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface FinancialBarChartWidgetProps {
  data: ExpenseData[];
  title?: string;
  onClick?: () => void;
  showCardNumber?: boolean;
  cardNumber?: string;
}

export default function FinancialBarChartWidget({
  data,
  title,
  onClick,
  showCardNumber,
  cardNumber,
}: FinancialBarChartWidgetProps) {
  const { targetHeight } = useWidgetHeight();

  return (
    <WidgetBase
      className="flex flex-col"
      style={{
        height: targetHeight,
      }}
    >
      <FinancialBarChart
        data={data}
        title={title}
        onClick={onClick}
        showCardNumber={showCardNumber}
        cardNumber={cardNumber}
      />
    </WidgetBase>
  );
}
