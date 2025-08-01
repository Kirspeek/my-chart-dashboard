"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import { useWalletCardLogic } from "./useWalletCardLogic";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import SpendingProgress from "./SpendingProgress";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";

export default function WalletCardWidget() {
  const {
    currentCard,
    selectedCardIndex,
    handleCardClick,
    hasCards,
    totalCards,
  } = useWalletCardLogic();

  const { targetHeight } = useWidgetHeight();

  // Calculate dynamic styling based on height
  const widgetStyle = useMemo(
    () => ({
      height: targetHeight,
      marginTop: "40px",
      transition: "height 0.3s ease-in-out", // Smooth transition for height changes
    }),
    [targetHeight]
  );

  const contentStyle = useMemo(
    () => ({
      marginTop: "-40px",
      transition: "all 0.3s ease-in-out", // Smooth transition for content adjustments
    }),
    []
  );

  if (!hasCards) {
    return (
      <WidgetBase
        className="w-full h-full flex flex-col items-center justify-center p-6"
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

  return (
    <WidgetBase
      className="w-full h-full flex flex-col items-center justify-center p-6"
      style={widgetStyle}
    >
      <div
        className="w-full max-w-sm h-full flex flex-col"
        style={contentStyle}
      >
        {/* Monthly Expenses Chart */}
        <div className="flex-1">
          <MonthlyExpensesChart card={currentCard} onClick={handleCardClick} />
        </div>

        {/* Progress Indicators */}
        <div className="mt-6">
          <SpendingProgress
            selectedIndex={selectedCardIndex}
            totalCards={totalCards}
          />
        </div>
      </div>
    </WidgetBase>
  );
}
