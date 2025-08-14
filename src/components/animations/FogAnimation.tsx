import React from "react";

const fogKeyframes = `
@keyframes fog-drift-1 { 
  0% { transform: translateX(-100%) translateY(0px); opacity: 0; } 
  10% { opacity: 0.8; }
  25% { transform: translateX(-50%) translateY(-5px); }
  50% { transform: translateX(0%) translateY(3px); }
  75% { transform: translateX(50%) translateY(-2px); }
  90% { opacity: 0.8; }
  100% { transform: translateX(100%) translateY(0px); opacity: 0; } 
}
@keyframes fog-drift-2 { 
  0% { transform: translateX(-100%) translateY(0px); opacity: 0; } 
  15% { opacity: 0.6; }
  30% { transform: translateX(-40%) translateY(4px); }
  60% { transform: translateX(20%) translateY(-3px); }
  85% { opacity: 0.6; }
  100% { transform: translateX(100%) translateY(0px); opacity: 0; } 
}
@keyframes fog-drift-3 { 
  0% { transform: translateX(-100%) translateY(0px); opacity: 0; } 
  20% { opacity: 0.4; }
  40% { transform: translateX(-30%) translateY(-4px); }
  70% { transform: translateX(40%) translateY(2px); }
  80% { opacity: 0.4; }
  100% { transform: translateX(100%) translateY(0px); opacity: 0; } 
}
@keyframes fog-drift-4 { 
  0% { transform: translateX(-100%) translateY(0px) scale(1); opacity: 0; } 
  12% { opacity: 0.7; }
  35% { transform: translateX(-45%) translateY(6px) scale(1.1); }
  65% { transform: translateX(25%) translateY(-4px) scale(0.9); }
  88% { opacity: 0.7; }
  100% { transform: translateX(100%) translateY(0px) scale(1); opacity: 0; } 
}
@keyframes fog-drift-5 { 
  0% { transform: translateX(-100%) translateY(0px) rotate(0deg); opacity: 0; } 
  18% { opacity: 0.5; }
  45% { transform: translateX(-35%) translateY(-3px) rotate(2deg); }
  75% { transform: translateX(35%) translateY(5px) rotate(-1deg); }
  82% { opacity: 0.5; }
  100% { transform: translateX(100%) translateY(0px) rotate(0deg); opacity: 0; } 
}
@keyframes fog-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  25% { opacity: 0.5; transform: scale(1.02); }
  50% { opacity: 0.7; transform: scale(1.05); }
  75% { opacity: 0.5; transform: scale(1.02); }
}
@keyframes fog-swirl {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(0.9); }
  75% { transform: rotate(270deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}
@keyframes fog-breathe {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50% { opacity: 0.8; transform: scaleY(1.2); }
}
`;

const containerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
  overflow: "hidden",
  borderTopLeftRadius: "2rem",
  borderBottomLeftRadius: "2rem",
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
};

const fogLayerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
  filter: "blur(8px)",
  animation: "fog-breathe 6s ease-in-out infinite",
};

const smogLayerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "radial-gradient(ellipse at center, rgba(169,169,169,0.4) 0%, rgba(169,169,169,0.1) 60%, transparent 100%)",
  filter: "blur(12px)",
  animation: "fog-swirl 20s linear infinite",
};

const gradientMaskStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  borderTopLeftRadius: "2rem",
  borderBottomLeftRadius: "2rem",
  background:
    "linear-gradient(to right, rgba(240,240,240,0.4) 0%, rgba(240,240,240,0.1) 40%, rgba(240,240,240,0.05) 80%, rgba(240,240,240,0) 100%)",
  zIndex: 3,
};

// SVG-based fog patches for better quality with organic movement
const FogPatch = ({
  delay = 0,
  duration = 20,
  opacity = 0.6,
  y = 50,
  animationType = "fog-drift-1",
}: {
  delay?: number;
  duration?: number;
  opacity?: number;
  y?: number;
  animationType?: string;
}) => (
  <div
    style={{
      position: "absolute",
      top: `${y}%`,
      left: "-20%",
      width: "140%",
      height: "60px",
      animation: `${animationType} ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      opacity,
      transformOrigin: "center center",
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id={`fogGrad-${delay}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <path
        d="M0,30 Q50,10 100,30 Q150,50 200,30 Q250,10 300,30 Q350,50 400,30 L400,60 L0,60 Z"
        fill={`url(#fogGrad-${delay})`}
        opacity={opacity}
      />
    </svg>
  </div>
);

// Smog patches for more realistic effect with organic movement
const SmogPatch = ({
  delay = 0,
  duration = 25,
  opacity = 0.4,
  y = 30,
  animationType = "fog-drift-2",
}: {
  delay?: number;
  duration?: number;
  opacity?: number;
  y?: number;
  animationType?: string;
}) => (
  <div
    style={{
      position: "absolute",
      top: `${y}%`,
      left: "-15%",
      width: "130%",
      height: "80px",
      animation: `${animationType} ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      opacity,
      transformOrigin: "center center",
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 80"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id={`smogGrad-${delay}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(169,169,169,0.6)" />
          <stop offset="60%" stopColor="rgba(169,169,169,0.3)" />
          <stop offset="100%" stopColor="rgba(169,169,169,0)" />
        </radialGradient>
      </defs>
      <path
        d="M0,40 Q60,20 120,40 Q180,60 240,40 Q300,20 360,40 Q400,60 400,40 L400,80 L0,80 Z"
        fill={`url(#smogGrad-${delay})`}
        opacity={opacity}
      />
    </svg>
  </div>
);

export default function FogAnimation() {
  return (
    <div style={containerStyle}>
      <style>{fogKeyframes}</style>

      {/* Base fog layer with breathing effect */}
      <div style={fogLayerStyle} />

      {/* Base smog layer with swirling effect */}
      <div style={smogLayerStyle} />

      {/* Animated fog patches - appear immediately with organic movement */}
      <FogPatch
        delay={0}
        duration={16}
        opacity={0.7}
        y={20}
        animationType="fog-drift-1"
      />
      <FogPatch
        delay={4}
        duration={19}
        opacity={0.5}
        y={60}
        animationType="fog-drift-2"
      />
      <FogPatch
        delay={8}
        duration={22}
        opacity={0.6}
        y={40}
        animationType="fog-drift-3"
      />
      <FogPatch
        delay={12}
        duration={18}
        opacity={0.4}
        y={80}
        animationType="fog-drift-4"
      />
      <FogPatch
        delay={16}
        duration={21}
        opacity={0.5}
        y={30}
        animationType="fog-drift-5"
      />

      {/* Animated smog patches - more realistic pollution effect with organic movement */}
      <SmogPatch
        delay={2}
        duration={24}
        opacity={0.5}
        y={35}
        animationType="fog-drift-2"
      />
      <SmogPatch
        delay={6}
        duration={27}
        opacity={0.3}
        y={70}
        animationType="fog-drift-3"
      />
      <SmogPatch
        delay={10}
        duration={23}
        opacity={0.4}
        y={50}
        animationType="fog-drift-4"
      />
      <SmogPatch
        delay={14}
        duration={26}
        opacity={0.3}
        y={65}
        animationType="fog-drift-5"
      />

      {/* Pulsing atmospheric effect with enhanced movement */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
          animation: "fog-pulse 4s ease-in-out infinite",
          transformOrigin: "center center",
        }}
      />

      {/* Additional swirling fog elements */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          width: "60%",
          height: "40%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)",
          animation: "fog-swirl 15s linear infinite",
          filter: "blur(15px)",
        }}
      />

      {/* Gradient mask for soft fade at edges */}
      <div style={gradientMaskStyle} />
    </div>
  );
}
