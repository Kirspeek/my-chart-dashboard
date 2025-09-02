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
      {!hideHeader && (
        <PayHeader
          leftTitle={showCardNumber ? cardNumber || "**** ****" : "All Cards"}
          leftButtons={leftButtons}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      )}

      {!hideHeader && isMobile && <div style={{ height: "0.75rem" }} />}

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
