import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function SunAnimation() {
  const { colorsTheme } = useTheme();
  const sunAnimationColors = colorsTheme.widgets.sunAnimation;
  // Animation timing
  const duration = 2.2;
  const width = 220;
  const height = 220;
  const sunCX = width / 2;
  const sunCY = height / 2;
  const sunRMin = 60;
  const sunRMax = 80;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    function animate(ts: number) {
      if (start === null) start = ts;
      const elapsed = (ts - start) / 1000;
      let t = (elapsed % duration) / duration;
      if (Math.floor(elapsed / duration) % 2 === 1) t = 1 - t;
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);
      setProgress(eased);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  const sunR = sunRMin + (sunRMax - sunRMin) * progress;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
    >
      <g>
        <circle
          cx={sunCX}
          cy={sunCY}
          r={sunR}
          fill="url(#sunGrad)"
          filter="url(#sunGlow)"
        />
      </g>
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={sunAnimationColors.gradient.start} />
          <stop offset="100%" stopColor={sunAnimationColors.gradient.end} />
        </radialGradient>
        <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
