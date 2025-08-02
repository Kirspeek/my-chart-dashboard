import React from "react";

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
    <div className="flex justify-center mb-4 flex-1 items-center">
      <canvas
        ref={canvasRef}
        width={350}
        height={200}
        className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} max-w-full max-h-full`}
        style={{
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
          touchAction: "none",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    </div>
  );
}
