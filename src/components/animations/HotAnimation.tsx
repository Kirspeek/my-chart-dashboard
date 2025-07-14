import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HotAnimation() {
  // Animation timing
  const duration = 2.2;

  // Smaller overall size
  const width = 60;
  const height = 160;
  const tubeW = 11;
  const tubeH = 48;
  const tubeX = (width - tubeW) / 2;
  const tubeY = 32;
  const bulbR = 13;
  const bulbCX = width / 2;
  const bulbCY = tubeY + tubeH + bulbR - 3;
  const tickCount = 8;
  const tickGap = (tubeH - 8) / (tickCount - 1);
  const tickLen = 12;

  // Sun
  const sunCX = width / 2;
  const sunCY = 26;
  const sunRMin = 13;
  const sunRMax = 19;

  // Animation state for sync
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    function animate(ts: number) {
      if (start === null) start = ts;
      const elapsed = (ts - start) / 1000;
      let t = (elapsed % duration) / duration;
      if (Math.floor(elapsed / duration) % 2 === 1) t = 1 - t;
      // Use a sine-based ease for smooth in/out
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * t);
      setProgress(eased);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Mercury animation values
  const mercuryMin = 16;
  const mercuryMax = 40;
  const mercuryHeight = mercuryMin + (mercuryMax - mercuryMin) * progress;
  const mercuryY = tubeY + tubeH - mercuryHeight;

  // Sun radius synced with mercury
  const sunR = sunRMin + (sunRMax - sunRMin) * progress;

  return (
    <div style={{ width, height, position: "absolute", top: 0, right: 0 }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        {/* Sun with realistic glow, no lines */}
        <g>
          <circle
            cx={sunCX}
            cy={sunCY}
            r={sunR}
            fill="url(#sunGrad)"
            filter="url(#sunGlow)"
          />
        </g>
        {/* Tube (stem) */}
        <rect
          x={tubeX}
          y={tubeY}
          width={tubeW}
          height={tubeH}
          rx={tubeW / 2.2}
          fill="#fff"
          stroke="#444"
          strokeWidth={2}
        />
        {/* Tick marks */}
        {[...Array(tickCount)].map((_, i) => (
          <rect
            key={i}
            x={tubeX + tubeW + 4}
            y={tubeY + 3 + i * tickGap}
            width={tickLen}
            height={1.5}
            rx={0.75}
            fill="#444"
            opacity={0.7}
          />
        ))}
        {/* Mercury (animated) */}
        <rect
          x={tubeX + 1.5}
          y={mercuryY}
          width={tubeW - 3}
          height={mercuryHeight}
          rx={(tubeW - 3) / 2.2}
          fill="url(#mercuryGrad)"
        />
        {/* Bulb (animated glow) */}
        <motion.circle
          cx={bulbCX}
          cy={bulbCY}
          r={bulbR}
          fill="url(#mercuryGrad)"
          stroke="#444"
          strokeWidth={2.5}
          initial={{ filter: "drop-shadow(0 0 0px #ff5722)" }}
          animate={{
            filter: [
              "drop-shadow(0 0 0px #ff5722)",
              "drop-shadow(0 0 10px #ff5722)",
              "drop-shadow(0 0 0px #ff5722)",
            ],
          }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: [0.77, 0, 0.18, 1],
          }}
        />
        {/* SVG Gradients and Filters */}
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="100%" stopColor="#FFD54F" />
          </radialGradient>
          <linearGradient id="mercuryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7043" />
            <stop offset="100%" stopColor="#d32f2f" />
          </linearGradient>
          <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
