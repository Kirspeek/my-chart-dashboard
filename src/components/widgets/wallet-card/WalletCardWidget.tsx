"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { useWheelWidgetLogic } from "../../../hooks/useWheelWidgetLogic";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";
import { useTheme } from "../../../hooks/useTheme";

export default function WalletCardWidget({
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const { currentCard, handleCardClick, hasCards, currentCardData } =
    useWheelWidgetLogic();

  const { targetHeight } = useWidgetHeight();
  const { colorsTheme } = useTheme();
  const walletCardColors = colorsTheme.widgets.walletCard;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 425;

  // Calculate dynamic styling based on height
  const widgetStyle = useMemo(
    () => ({
      height: targetHeight,
      marginTop: isMobile ? undefined : "40px",
      transition: "height 0.3s ease-in-out",
    }),
    [targetHeight, isMobile]
  );

  const contentStyle = useMemo(
    () => ({
      marginTop: isMobile ? undefined : "-40px",
      transition: "all 0.3s ease-in-out",
    }),
    [isMobile]
  );

  if (!hasCards || !currentCardData) {
    return (
      <WidgetBase
        className="wheel-widget w-full h-full flex flex-col items-center justify-center p-6"
        style={widgetStyle}
        onOpenSidebar={onOpenSidebar}
        showSidebarButton={showSidebarButton}
      >
        <div
          className="text-center"
          style={{
            color: "var(--secondary-text)",
            marginTop: isMobile ? undefined : "-40px",
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
              color: walletCardColors.button.text,
              fontFamily: "var(--font-sans)",
            }}
          >
            Refresh
          </button>
        </div>
        {/* Navigation buttons */}
        {currentSlide !== undefined && setCurrentSlide && (
          <SlideNavigation
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            totalSlides={16}
          />
        )}
      </WidgetBase>
    );
  }

  return (
    <WidgetBase
      className="wheel-widget w-full h-full flex flex-col items-center justify-center p-6"
      style={widgetStyle}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <div
        className="w-full max-w-sm h-full flex flex-col"
        style={contentStyle}
      >
        {/* Monthly Expenses Chart */}
        <div className="flex-1">
          {currentCard && (
            <MonthlyExpensesChart
              card={currentCard}
              onClick={handleCardClick}
            />
          )}
        </div>

        {/* Progress Indicators removed */}
      </div>
      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
