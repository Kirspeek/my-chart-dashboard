"use client";

import React from "react";
import BottomSegmentInfo from "../../common/BottomSegmentInfo";
import { SpendingChartProps } from "../../../../interfaces/widgets";
import {
  useWheelChartLogic,
  useWheelInteractionLogic,
  useWheelRenderLogic,
} from "./logic";
import { WheelHeader, WheelSpendingDisplay, WheelCanvas } from "./components";

export default function SpendingChart({
  data,
  annualData,
  title = "Total Spending",
  onClick,
  showCardNumber = false,
  cardNumber,
}: SpendingChartProps) {
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

  const { bottomSegment } = useWheelRenderLogic(
    currentData,
    rotationAngle,
    canvasRef
  );

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
      <WheelHeader
        showCardNumber={showCardNumber}
        cardNumber={cardNumber}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Total Spending Display */}
      <WheelSpendingDisplay title={title} totalSpending={totalSpending} />

      {/* 3D Donut Chart Canvas */}
      <WheelCanvas
        canvasRef={canvasRef}
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => handleCanvasClick(e, onClick)}
      />

      {/* Bottom Segment Info */}
      {bottomSegment && <BottomSegmentInfo segment={bottomSegment} />}
    </div>
  );
}
