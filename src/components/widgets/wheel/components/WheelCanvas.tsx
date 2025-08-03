import React from "react";
import { ChartCanvas } from "../../../common";

interface WheelCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<Element>) => void;
  onMouseMove: (e: React.MouseEvent<Element>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick?: (e: React.MouseEvent<Element>) => void;
}

export default function WheelCanvas({
  canvasRef,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
}: WheelCanvasProps) {
  return (
    <ChartCanvas
      className="flex justify-center mb-4 flex-1 items-center"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <canvas
        ref={canvasRef}
        width={350}
        height={200}
        className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} max-w-full max-h-full`}
        style={{
          touchAction: "none",
        }}
      />
    </ChartCanvas>
  );
}
