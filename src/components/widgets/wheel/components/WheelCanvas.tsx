import React from "react";
import { ChartCanvas } from "../../../common";

interface WheelCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
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
