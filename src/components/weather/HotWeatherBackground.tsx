import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useEffect, useState } from "react";

// Thin, wispy orange cloud SVG
const HotCloudSVG = ({ style = {} }) => (
  <svg width="160" height="40" viewBox="0 0 160 40" fill="none" style={style}>
    <ellipse
      cx="50"
      cy="28"
      rx="48"
      ry="10"
      fill="#ffb347"
      fillOpacity="0.32"
    />
    <ellipse
      cx="110"
      cy="18"
      rx="32"
      ry="7"
      fill="#ff7043"
      fillOpacity="0.22"
    />
    <ellipse cx="80" cy="12" rx="38" ry="6" fill="#ffd580" fillOpacity="0.18" />
  </svg>
);

export default function HotWeatherBackground({
  children,
  inset = false,
}: {
  children: ReactNode;
  inset?: boolean;
}) {
  // HotAnimation logic
  const duration = 2.2;
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
  const sunCX = width / 2;
  const sunCY = 26;
  const sunRMin = 13;
  const sunRMax = 19;
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
  const mercuryMin = 16;
  const mercuryMax = 40;
  const mercuryHeight = mercuryMin + (mercuryMax - mercuryMin) * progress;
  const mercuryY = tubeY + tubeH - mercuryHeight;
  const sunR = sunRMin + (sunRMax - sunRMin) * progress;

  const bgContent = (
    <>
      {/* Orange gradient background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background: "linear-gradient(165deg, #ff512f 0%, #ffb347 100%)",
        }}
      />
      {/* Animated clouds */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: "100vw" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 28,
          ease: "linear",
        }}
        style={{ position: "absolute", top: 18, left: 0, zIndex: 1 }}
      >
        <HotCloudSVG style={{ width: 120, height: 28, opacity: 0.7 }} />
      </motion.div>
      <motion.div
        initial={{ x: -60 }}
        animate={{ x: "100vw" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 18,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          zIndex: 1,
          opacity: 0.5,
        }}
      >
        <HotCloudSVG style={{ width: 80, height: 18, opacity: 0.5 }} />
      </motion.div>
      {/* HotAnimation thermometer and sun in top right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width,
          height,
          zIndex: 2,
        }}
      >
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
    </>
  );

  if (inset) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "2rem",
        }}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {bgContent}
        </div>
        <div style={{ position: "relative", zIndex: 3 }}>{children}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "2rem",
      }}
    >
      {bgContent}
      <div style={{ position: "relative", zIndex: 3 }}>{children}</div>
    </div>
  );
}
