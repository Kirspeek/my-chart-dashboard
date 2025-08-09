"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import SpendingChart from "./SpendingChart";
import { useWheelWidgetLogic } from "../../../hooks/useWheelWidgetLogic";
import { generateStableExpenseData } from "../../../utils/wheelUtils";

export default function WheelWidget() {
  const { currentCard, handleCardClick, hasCards, currentCardData } =
    useWheelWidgetLogic();

  const contentStyle = useMemo(
    () => ({
      opacity: 1,
      transform: "scale(1)",
      transition: "all 0.3s ease-in-out",
    }),
    []
  );

  const widgetStyle = useMemo(
    () => ({
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      borderRadius: "16px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
    }),
    []
  );

  if (!hasCards || !currentCardData) {
    return (
      <WidgetBase
        className="wheel-widget w-full h-full flex flex-col items-center justify-center p-6"
        style={widgetStyle}
      >
        <div
          className="text-center"
          style={{
            color: "#888",
            marginTop: "-40px",
          }}
        >
          <div
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            No Cards Available
          </div>
          <div
            className="text-sm mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Add cards to your wallet to see them here
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg hover:opacity-80 transition-opacity text-sm"
            style={{
              backgroundColor: "#7bc2e8",
              color: "#ffffff",
              fontFamily: "var(--font-sans)",
            }}
          >
            Refresh
          </button>
        </div>
      </WidgetBase>
    );
  }

  const fallbackMonthly = generateStableExpenseData(
    currentCard?.cardNumber || "**** ****",
    currentCardData.monthlySpending
  );

  const fallbackAnnual = generateStableExpenseData(
    currentCard?.cardNumber || "**** ****",
    currentCardData.monthlySpending * 12
  );

  return (
    <WidgetBase
      className="wheel-widget w-full h-full flex flex-col items-center justify-center p-6"
      style={widgetStyle}
    >
      <div
        className="w-full max-w-sm h-full flex flex-col"
        style={contentStyle}
      >
        {/* Monthly Expenses Chart */}
        <div className="flex-1">
          <SpendingChart
            data={fallbackMonthly}
            annualData={fallbackAnnual}
            onClick={handleCardClick}
            showCardNumber={true}
            cardNumber={currentCard?.cardNumber}
          />
        </div>

        {/* Progress indicators removed */}
      </div>
    </WidgetBase>
  );
}
