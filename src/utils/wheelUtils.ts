import {
  ExpenseData,
  Point3D,
  SegmentPoint,
  Segment3D,
  Face3D,
} from "@/interfaces/widgets";

export const WHEEL_CONFIG = {
  radius: 100,
  innerRadius: 50,
  depth: 35,
  alpha: -35,
  beta: 5,
  perspectiveDistance: 800,
  facetCount: 12,
  lightSource: { x: -200, y: -100, z: 100 },
  ambientLight: 0.3,
  diffuseLight: 0.7,
} as const;

export const rotate3D = (
  point: Point3D,
  alpha: number,
  beta: number
): Point3D => {
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

export const project3D = (point: Point3D): { x: number; y: number } => {
  const distance = WHEEL_CONFIG.perspectiveDistance;
  const scale = distance / (distance + point.z);
  return {
    x: point.x * scale,
    y: point.y * scale,
  };
};

export const getAngleFromPosition = (
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement | null
): number => {
  if (!canvas) return 0;

  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  return Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
};

export const generate3DSegments = (
  currentData: ExpenseData[],
  rotationAngle: number
): Segment3D[] => {
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
        x: Math.cos(angleRad) * WHEEL_CONFIG.radius,
        y: Math.sin(angleRad) * WHEEL_CONFIG.radius,
        z: 0,
      };

      const innerPoint: Point3D = {
        x: Math.cos(angleRad) * WHEEL_CONFIG.innerRadius,
        y: Math.sin(angleRad) * WHEEL_CONFIG.innerRadius,
        z: 0,
      };

      const outerBottomPoint: Point3D = {
        ...outerPoint,
        z: -WHEEL_CONFIG.depth,
      };
      const innerBottomPoint: Point3D = {
        ...innerPoint,
        z: -WHEEL_CONFIG.depth,
      };

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

export const generateFacetedSides = (segment: Segment3D): Face3D[] => {
  const faces: Face3D[] = [];

  for (let i = 0; i < segment.points.length - 1; i++) {
    const p1 = segment.points[i];
    const p2 = segment.points[i + 1];

    for (let f = 0; f < WHEEL_CONFIG.facetCount; f++) {
      const z1 = -(WHEEL_CONFIG.depth / WHEEL_CONFIG.facetCount) * f;
      const z2 = -(WHEEL_CONFIG.depth / WHEEL_CONFIG.facetCount) * (f + 1);

      const outerFacet: Face3D = {
        type: "outer-side",
        points: [
          rotate3D(
            { ...p1.outer, z: z1 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
          rotate3D(
            { ...p1.outer, z: z2 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
          rotate3D(
            { ...p2.outer, z: z2 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
          rotate3D(
            { ...p2.outer, z: z1 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
        ],
        color: segment.color,
        opacity: 0.8 - f * 0.05,
        zIndex: 5 - f,
      };
      faces.push(outerFacet);

      const innerFacet: Face3D = {
        type: "inner-side",
        points: [
          rotate3D(
            { ...p1.inner, z: z1 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
          rotate3D(
            { ...p1.inner, z: z2 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
          rotate3D(
            { ...p2.inner, z: z2 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
          rotate3D(
            { ...p2.inner, z: z1 },
            WHEEL_CONFIG.alpha,
            WHEEL_CONFIG.beta
          ),
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
export const calculateLighting = (
  facePoints: Point3D[],
  faceType: string
): number => {
  const center = {
    x: facePoints.reduce((sum, p) => sum + p.x, 0) / facePoints.length,
    y: facePoints.reduce((sum, p) => sum + p.y, 0) / facePoints.length,
    z: facePoints.reduce((sum, p) => sum + p.z, 0) / facePoints.length,
  };

  const lightDir = {
    x: WHEEL_CONFIG.lightSource.x - center.x,
    y: WHEEL_CONFIG.lightSource.y - center.y,
    z: WHEEL_CONFIG.lightSource.z - center.z,
  };

  const lightLength = Math.sqrt(
    lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z
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
  return WHEEL_CONFIG.ambientLight + WHEEL_CONFIG.diffuseLight * clampedDot;
};

// Generate stable expense data for consistent visualization
export const generateStableExpenseData = (
  cardNumber: string,
  monthlySpending: number
): ExpenseData[] => {
  const categories = [
    { name: "Food", color: "yellow", percentage: 31 },
    { name: "Transport", color: "blue", percentage: 25 },
    { name: "Entertainment", color: "slate", percentage: 22 },
    { name: "Shopping", color: "red", percentage: 22 },
  ];

  return categories.map((category) => ({
    name: category.name,
    value: Math.round((monthlySpending * category.percentage) / 100),
    color: category.color,
    percentage: category.percentage,
  }));
};

// Get the segment at the bottom of the wheel
export const getBottomSegment = (
  currentData: ExpenseData[],
  rotationAngle: number
): ExpenseData | null => {
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
