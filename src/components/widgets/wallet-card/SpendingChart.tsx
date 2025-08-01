"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "../../../hooks/useTheme";
import BottomSegmentInfo from "./BottomSegmentInfo";

interface SpendingChartProps {
  data: ExpenseData[];
  title?: string;
  onClick?: () => void;
  showCardNumber?: boolean;
  cardNumber?: string;
}

type TimePeriod = "Monthly" | "Annual";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface SegmentPoint {
  outer: Point3D;
  inner: Point3D;
  outerBottom: Point3D;
  innerBottom: Point3D;
}

interface Segment3D {
  points: SegmentPoint[];
  color: string;
  data: ExpenseData;
  startAngle: number;
  endAngle: number;
}

interface Face3D {
  type: "bottom" | "outer-side" | "inner-side" | "top";
  points: Point3D[];
  color: string;
  opacity: number;
  zIndex: number;
}

export default function SpendingChart({
  data,
  title = "Total Spending",
  onClick,
  showCardNumber = false,
  cardNumber,
}: SpendingChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Monthly");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accent } = useTheme();

  // Use the provided data or generate based on period
  const currentData = useMemo(() => {
    if (data.length > 0) {
      return data.map((item) => ({
        ...item,
        color: accent[item.color as keyof typeof accent] || accent.blue,
      }));
    }
    return [];
  }, [data, accent]);

  const totalSpending = useMemo(() => {
    const total = currentData.reduce((sum, item) => sum + item.value, 0);
    return `$${total.toLocaleString()}`;
  }, [currentData]);

  // 3D Configuration
  const radius = 100;
  const innerRadius = 50;
  const depth = 35;
  const alpha = -35;
  const beta = 5;
  const perspectiveDistance = 800;
  const facetCount = 12;

  // Lighting configuration
  const lightSource = { x: -200, y: -100, z: 100 };
  const ambientLight = 0.3;
  const diffuseLight = 0.7;

  // 3D transformation functions
  const rotate3D = (point: Point3D, alpha: number, beta: number): Point3D => {
    const alphaRad = (alpha * Math.PI) / 180;
    const betaRad = (beta * Math.PI) / 180;

    const cosAlpha = Math.cos(alphaRad);
    const sinAlpha = Math.sin(alphaRad);
    const cosBeta = Math.cos(betaRad);
    const sinBeta = Math.sin(betaRad);

    const x = point.x * cosBeta - point.z * sinBeta;
    const y =
      point.x * sinAlpha * sinBeta +
      point.y * cosAlpha +
      point.z * sinAlpha * cosBeta;
    const z =
      point.x * cosAlpha * sinBeta -
      point.y * sinAlpha +
      point.z * cosAlpha * cosBeta;

    return { x, y, z };
  };

  const project3D = (point: Point3D): { x: number; y: number } => {
    const distance = perspectiveDistance;
    const scale = distance / (distance + point.z);
    return {
      x: point.x * scale,
      y: point.y * scale,
    };
  };

  // Calculate angle from mouse/touch position
  const getAngleFromPosition = (clientX: number, clientY: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    return Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
  };

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    const angle = getAngleFromPosition(e.clientX, e.clientY);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    setHasDragged(true);
    const angle = getAngleFromPosition(e.clientX, e.clientY);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const angle = getAngleFromPosition(touch.clientX, touch.clientY);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const angle = getAngleFromPosition(touch.clientX, touch.clientY);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Generate 3D donut segments
  const generate3DSegments = (): Segment3D[] => {
    const segments: Segment3D[] = [];
    let currentAngle = rotationAngle;

    currentData.forEach((item) => {
      const segmentAngle = (item.percentage / 100) * 360;
      const endAngle = currentAngle + segmentAngle;

      const points: SegmentPoint[] = [];
      const steps = Math.max(20, Math.floor(segmentAngle / 3));

      for (let i = 0; i <= steps; i++) {
        const angle = currentAngle + (segmentAngle * i) / steps;
        const angleRad = (angle * Math.PI) / 180;

        const outerPoint: Point3D = {
          x: Math.cos(angleRad) * radius,
          y: Math.sin(angleRad) * radius,
          z: 0,
        };

        const innerPoint: Point3D = {
          x: Math.cos(angleRad) * innerRadius,
          y: Math.sin(angleRad) * innerRadius,
          z: 0,
        };

        const outerBottomPoint: Point3D = { ...outerPoint, z: -depth };
        const innerBottomPoint: Point3D = { ...innerPoint, z: -depth };

        points.push({
          outer: outerPoint,
          inner: innerPoint,
          outerBottom: outerBottomPoint,
          innerBottom: innerBottomPoint,
        });
      }

      segments.push({
        points,
        color: item.color,
        data: item,
        startAngle: currentAngle,
        endAngle: endAngle,
      });

      currentAngle = endAngle;
    });

    return segments;
  };

  // Generate faceted side walls
  const generateFacetedSides = (segment: Segment3D): Face3D[] => {
    const faces: Face3D[] = [];

    for (let i = 0; i < segment.points.length - 1; i++) {
      const p1 = segment.points[i];
      const p2 = segment.points[i + 1];

      for (let f = 0; f < facetCount; f++) {
        const z1 = -(depth / facetCount) * f;
        const z2 = -(depth / facetCount) * (f + 1);

        const outerFacet: Face3D = {
          type: "outer-side",
          points: [
            rotate3D({ ...p1.outer, z: z1 }, alpha, beta),
            rotate3D({ ...p1.outer, z: z2 }, alpha, beta),
            rotate3D({ ...p2.outer, z: z2 }, alpha, beta),
            rotate3D({ ...p2.outer, z: z1 }, alpha, beta),
          ],
          color: segment.color,
          opacity: 0.8 - f * 0.05,
          zIndex: 5 - f,
        };
        faces.push(outerFacet);

        const innerFacet: Face3D = {
          type: "inner-side",
          points: [
            rotate3D({ ...p1.inner, z: z1 }, alpha, beta),
            rotate3D({ ...p1.inner, z: z2 }, alpha, beta),
            rotate3D({ ...p2.inner, z: z2 }, alpha, beta),
            rotate3D({ ...p2.inner, z: z1 }, alpha, beta),
          ],
          color: segment.color,
          opacity: 0.7 - f * 0.04,
          zIndex: 5 - f,
        };
        faces.push(innerFacet);
      }
    }

    return faces;
  };

  // Calculate lighting
  const calculateLighting = (
    facePoints: Point3D[],
    faceType: string
  ): number => {
    const center = {
      x: facePoints.reduce((sum, p) => sum + p.x, 0) / facePoints.length,
      y: facePoints.reduce((sum, p) => sum + p.y, 0) / facePoints.length,
      z: facePoints.reduce((sum, p) => sum + p.z, 0) / facePoints.length,
    };

    const lightDir = {
      x: lightSource.x - center.x,
      y: lightSource.y - center.y,
      z: lightSource.z - center.z,
    };

    const lightLength = Math.sqrt(
      lightDir.x * lightDir.x +
        lightDir.y * lightDir.y +
        lightDir.z * lightDir.z
    );
    const normalizedLight = {
      x: lightDir.x / lightLength,
      y: lightDir.y / lightLength,
      z: lightDir.z / lightLength,
    };

    let faceNormal = { x: 0, y: 0, z: 1 };

    if (faceType === "top") {
      faceNormal = { x: 0, y: 0, z: 1 };
    } else if (faceType === "bottom") {
      faceNormal = { x: 0, y: 0, z: -1 };
    } else if (faceType === "outer-side") {
      const angle = Math.atan2(center.y, center.x);
      faceNormal = { x: Math.cos(angle), y: Math.sin(angle), z: 0 };
    } else if (faceType === "inner-side") {
      const angle = Math.atan2(center.y, center.x);
      faceNormal = { x: -Math.cos(angle), y: -Math.sin(angle), z: 0 };
    }

    const dotProduct =
      normalizedLight.x * faceNormal.x +
      normalizedLight.y * faceNormal.y +
      normalizedLight.z * faceNormal.z;

    const clampedDot = Math.max(0, Math.min(1, dotProduct));
    return ambientLight + diffuseLight * clampedDot;
  };

  // Draw the 3D donut chart
  const draw3DDonutChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const segments = generate3DSegments();
    const allFaces: Face3D[] = [];

    segments.forEach((segment) => {
      // Bottom faces
      for (let i = 0; i < segment.points.length - 1; i++) {
        const p1 = segment.points[i];
        const p2 = segment.points[i + 1];

        const bottomFace: Face3D = {
          type: "bottom",
          points: [
            rotate3D(p1.outerBottom, alpha, beta),
            rotate3D(p2.outerBottom, alpha, beta),
            rotate3D(p2.innerBottom, alpha, beta),
            rotate3D(p1.innerBottom, alpha, beta),
          ],
          color: segment.color,
          opacity: 0.6,
          zIndex: 1,
        };
        allFaces.push(bottomFace);
      }

      const facetedSides = generateFacetedSides(segment);
      allFaces.push(...facetedSides);

      // Top faces
      for (let i = 0; i < segment.points.length - 1; i++) {
        const p1 = segment.points[i];
        const p2 = segment.points[i + 1];

        const topFace: Face3D = {
          type: "top",
          points: [
            rotate3D(p1.outer, alpha, beta),
            rotate3D(p2.outer, alpha, beta),
            rotate3D(p2.inner, alpha, beta),
            rotate3D(p1.inner, alpha, beta),
          ],
          color: segment.color,
          opacity: 1,
          zIndex: 10,
        };
        allFaces.push(topFace);
      }
    });

    // Sort faces by Z-depth
    allFaces.sort((a, b) => {
      const aZ =
        a.points.reduce((sum: number, p: Point3D) => sum + p.z, 0) /
        a.points.length;
      const bZ =
        b.points.reduce((sum: number, p: Point3D) => sum + p.z, 0) /
        b.points.length;
      return aZ - bZ;
    });

    // Draw all faces
    allFaces.forEach((face) => {
      const projectedPoints = face.points.map((p: Point3D) => project3D(p));
      const lighting = calculateLighting(face.points, face.type);
      const adjustedOpacity = face.opacity * lighting;

      ctx.save();
      ctx.globalAlpha = adjustedOpacity;
      ctx.fillStyle = face.color;
      ctx.strokeStyle =
        face.type === "top" ? `rgba(0, 0, 0, 0.4)` : `rgba(0, 0, 0, 0.3)`;
      ctx.lineWidth = face.type === "top" ? 1 : 0.5;

      ctx.beginPath();
      ctx.moveTo(
        centerX + projectedPoints[0].x,
        centerY + projectedPoints[0].y
      );

      for (let i = 1; i < projectedPoints.length; i++) {
        ctx.lineTo(
          centerX + projectedPoints[i].x,
          centerY + projectedPoints[i].y
        );
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });
  };

  useEffect(() => {
    draw3DDonutChart();
  }, [currentData, rotationAngle]);

  // Get the segment at the bottom
  const getBottomSegment = (): ExpenseData | null => {
    if (currentData.length === 0) return null;

    const bottomPoint = (90 - rotationAngle) % 360;
    const normalizedBottomPoint =
      bottomPoint < 0 ? bottomPoint + 360 : bottomPoint;

    let currentAngle = 0;
    for (const segment of currentData) {
      const segmentAngle = (segment.percentage / 100) * 360;
      const endAngle = currentAngle + segmentAngle;

      if (
        normalizedBottomPoint >= currentAngle &&
        normalizedBottomPoint <= endAngle
      ) {
        return segment;
      }
      currentAngle = endAngle;
    }

    return currentData[0];
  };

  const bottomSegment = getBottomSegment();

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Card Number and Period Toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#232323] text-lg font-mono">
          {showCardNumber ? cardNumber || "**** ****" : "All Cards"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPeriod("Monthly");
            }}
            className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
            style={{
              fontFamily: "var(--font-sans)",
              color: selectedPeriod === "Monthly" ? "#232323" : "#888",
              backgroundColor:
                selectedPeriod === "Monthly"
                  ? "rgba(0,0,0,0.05)"
                  : "transparent",
            }}
          >
            Monthly
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPeriod("Annual");
            }}
            className={`text-xs font-medium transition-colors px-2 py-1 rounded`}
            style={{
              fontFamily: "var(--font-sans)",
              color: selectedPeriod === "Annual" ? "#232323" : "#888",
              backgroundColor:
                selectedPeriod === "Annual"
                  ? "rgba(0,0,0,0.05)"
                  : "transparent",
            }}
          >
            Annual
          </button>
        </div>
      </div>

      {/* Total Spending Display */}
      <div className="text-center mb-2">
        <div className="text-sm text-[#888] mb-1">{title}</div>
        <div className="text-2xl font-bold text-[#232323] font-mono">
          {totalSpending}
        </div>
      </div>

      {/* 3D Donut Chart Canvas */}
      <div className="flex justify-center mb-4 flex-1 flex items-center">
        <canvas
          ref={canvasRef}
          width={350}
          height={200}
          className={`${isDragging ? "cursor-grabbing" : "cursor-grab"} max-w-full max-h-full`}
          style={{
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
            touchAction: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Bottom Segment Info */}
      {bottomSegment && <BottomSegmentInfo segment={bottomSegment} />}
    </div>
  );
}
