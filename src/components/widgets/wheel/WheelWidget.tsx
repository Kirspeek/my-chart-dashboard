"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import SpendingChart from "./SpendingChart";
import { useWheelWidgetLogic } from "../../../hooks/useWheelWidgetLogic";
import { generateStableExpenseData } from "../../../utils/wheelUtils";
import { useTheme } from "../../../hooks/useTheme";

export default function WheelWidget() {
  const { currentCard, handleCardClick, hasCards, currentCardData } =
    useWheelWidgetLogic();
  const { colorsTheme } = useTheme();
  const wheelColors = colorsTheme.widgets.wheel;

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
      background: wheelColors.background.gradient,
      borderRadius: "16px",
      boxShadow: wheelColors.background.shadow,
      border: `1px solid ${wheelColors.background.border}`,
      backdropFilter: "blur(10px)",
    }),
    [wheelColors.background]
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
            color: "var(--secondary-text)",
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
              backgroundColor: "var(--accent-color)",
              color: wheelColors.button.text,
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
