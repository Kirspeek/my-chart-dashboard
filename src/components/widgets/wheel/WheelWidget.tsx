"use client";

import React, { useMemo } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { useWheelWidgetLogic } from "../../../hooks/useWheelWidgetLogic";
import WheelMonthlyExpensesChart from "./WheelMonthlyExpensesChart";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";

export default function WheelWidget({
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

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 425;

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

  // Always show waves animation, even when no cards are available
  if (!hasCards || !currentCardData) {
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
          <div className="flex-1">
            <WheelMonthlyExpensesChart
              card={null}
              onClick={handleCardClick}
            />
          </div>
        </div>
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
        <div className="flex-1">
          {currentCard && (
            <WheelMonthlyExpensesChart
              card={currentCard}
              onClick={handleCardClick}
            />
          )}
        </div>
      </div>
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
