import { useState, useRef, useCallback, useEffect } from "react";
import { getAngleFromPosition } from "@/utils/wheelUtils";

export const useWheelInteractionLogic = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseDown = (e: React.MouseEvent<Element>) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    const angle = getAngleFromPosition(e.clientX, e.clientY, canvasRef.current);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleMouseMove = (e: React.MouseEvent<Element>) => {
    if (!isDragging) return;
    e.preventDefault();
    setHasDragged(true);
    const angle = getAngleFromPosition(e.clientX, e.clientY, canvasRef.current);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      setHasDragged(false);
    }, 50);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTimeout(() => {
      setHasDragged(false);
    }, 50);
  };

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<Element>, onClick?: () => void) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (onClick) {
        onClick();
      }
    },
    [hasDragged]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const options = { passive: false } as const;

    const handleTouchStartPassive = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setHasDragged(false);
      const angle = getAngleFromPosition(touch.clientX, touch.clientY, canvas);
      setDragStartAngle(angle - rotationAngle);
    };

    const handleTouchMovePassive = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setHasDragged(true);
      const touch = e.touches[0];
      const angle = getAngleFromPosition(touch.clientX, touch.clientY, canvas);
      setRotationAngle(angle - dragStartAngle);
    };

    canvas.addEventListener("touchstart", handleTouchStartPassive, options);
    canvas.addEventListener("touchmove", handleTouchMovePassive, options);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStartPassive);
      canvas.removeEventListener("touchmove", handleTouchMovePassive);
    };
  }, [isDragging, rotationAngle, dragStartAngle]);

  return {
    rotationAngle,
    isDragging,
    hasDragged,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleCanvasClick,
  };
};
