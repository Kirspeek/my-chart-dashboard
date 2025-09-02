import React from "react";
import { ChartCanvas } from "../../common";

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
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 425;

  return (
    <ChartCanvas
      className="flex justify-center mb-4 flex-1 items-center"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        width: "100%",
        height: isMobile ? "calc(82vh - var(--spacing) * 6)" : "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        width={isMobile ? 300 : 350}
        height={isMobile ? 300 : 200}
        className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} max-w-full max-h-full`}
        style={{ touchAction: "none" }}
      />
    </ChartCanvas>
  );
}
