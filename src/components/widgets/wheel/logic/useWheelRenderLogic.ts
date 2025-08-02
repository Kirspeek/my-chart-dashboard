import { useEffect, useCallback } from "react";
import {
  generate3DSegments,
  generateFacetedSides,
  calculateLighting,
  project3D,
  getBottomSegment,
  rotate3D,
  WHEEL_CONFIG,
} from "../../../../utils/wheelUtils";
import {
  ExpenseData,
  Point3D,
  Face3D,
} from "../../../../../interfaces/widgets";

export const useWheelRenderLogic = (
  currentData: ExpenseData[],
  rotationAngle: number,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  // Draw the 3D donut chart
  const draw3DDonutChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const segments = generate3DSegments(currentData, rotationAngle);
    const allFaces: Face3D[] = [];

    segments.forEach((segment) => {
      // Bottom faces
      for (let i = 0; i < segment.points.length - 1; i++) {
        const p1 = segment.points[i];
        const p2 = segment.points[i + 1];

        const bottomFace: Face3D = {
          type: "bottom",
          points: [
            rotate3D(p1.outerBottom, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
            rotate3D(p2.outerBottom, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
            rotate3D(p2.innerBottom, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
            rotate3D(p1.innerBottom, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
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
            rotate3D(p1.outer, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
            rotate3D(p2.outer, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
            rotate3D(p2.inner, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
            rotate3D(p1.inner, WHEEL_CONFIG.alpha, WHEEL_CONFIG.beta),
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
  }, [currentData, rotationAngle, canvasRef]);

  useEffect(() => {
    draw3DDonutChart();
  }, [draw3DDonutChart]);

  // Get the segment at the bottom
  const bottomSegment = getBottomSegment(currentData, rotationAngle);

  return {
    bottomSegment,
  };
};
