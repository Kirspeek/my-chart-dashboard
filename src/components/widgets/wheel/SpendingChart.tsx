"use client";

import React from "react";
import { WheelChartProps } from "@/interfaces/widgets";
import {
  useWheelChartLogic,
  useWheelInteractionLogic,
  useWheelRenderLogic,
} from "./";
import WheelSpendingDisplay from "./WheelSpendingDisplay";
import SpendingSection from "../../common/SpendingSection";
import WheelCanvas from "./WheelCanvas";
import { PayHeader } from "../../common";

export default function SpendingChart({
  data,
  annualData,
  onClick,
  showCardNumber = false,
  cardNumber,
  hideHeader = false,
  leftButtons,
}: WheelChartProps & { hideHeader?: boolean; leftButtons?: React.ReactNode }) {
  // Use organized logic hooks
  const { selectedPeriod, setSelectedPeriod, currentData, totalSpending } =
    useWheelChartLogic(data, annualData);

  const {
    rotationAngle,
    isDragging,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleCanvasClick,
  } = useWheelInteractionLogic();

  // Restore the rendering logic but don't use bottomSegment
  useWheelRenderLogic(currentData, rotationAngle, canvasRef);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 425;

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 h-full flex flex-col"
      style={{
        opacity: 1,
        transform: "scale(1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Card Number and Period Toggle */}
      {!hideHeader && (
        <PayHeader
          leftTitle={showCardNumber ? cardNumber || "**** ****" : "All Cards"}
          leftButtons={leftButtons}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      )}

      {/* Mobile-only spacer before spending title */}
      {!hideHeader && isMobile && <div style={{ height: "0.75rem" }} />}

      {/* Total Spending Display */}
      {!hideHeader && (
        <SpendingSection>
          <WheelSpendingDisplay
            title={
              selectedPeriod === "Monthly"
                ? "Monthly Spending"
                : "Annual Spending"
            }
            totalSpending={totalSpending}
            trend={{
              direction: Math.random() > 0.5 ? "up" : "down",
              percentage: Math.floor(Math.random() * 20) + 1,
            }}
          />
        </SpendingSection>
      )}

      {/* 3D Donut Chart Canvas */}
      <WheelCanvas
        canvasRef={canvasRef}
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={(e: React.MouseEvent) => handleCanvasClick(e, onClick)}
      />
    </div>
  );
}
