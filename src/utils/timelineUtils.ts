export function shadeColor(
  color: string,
  percent: number,
  fallbackColor: string = "#666666"
) {
  if (!color || typeof color !== "string" || !color.startsWith("#"))
    return fallbackColor;
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  if (isNaN(R) || isNaN(G) || isNaN(B)) return fallbackColor;
  R = Math.min(255, Math.max(0, R + (255 - R) * percent));
  G = Math.min(255, Math.max(0, G + (255 - G) * percent));
  B = Math.min(255, Math.max(0, B + (255 - B) * percent));
  return (
    "#" +
    R.toString(16).padStart(2, "0") +
    G.toString(16).padStart(2, "0") +
    B.toString(16).padStart(2, "0")
  );
}

export function darkenColor(
  color: string,
  percent: number,
  fallbackColor: string = "#666666"
) {
  if (!color || typeof color !== "string" || !color.startsWith("#"))
    return fallbackColor;
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  if (isNaN(R) || isNaN(G) || isNaN(B)) return fallbackColor;
  R = Math.round(R * (1 - percent));
  G = Math.round(G * (1 - percent));
  B = Math.round(B * (1 - percent));
  return (
    "#" +
    R.toString(16).padStart(2, "0") +
    G.toString(16).padStart(2, "0") +
    B.toString(16).padStart(2, "0")
  );
}

export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
  ].join(" ");
}

export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
) {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
