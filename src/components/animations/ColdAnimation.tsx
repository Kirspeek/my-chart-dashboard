import React, { useMemo } from "react";

const NUMBER_OF_PARTICLES = 25;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function ColdAnimation() {
  const particles = useMemo(() => {
    return Array.from({ length: NUMBER_OF_PARTICLES }).map((_, i) => ({
      id: i,
      left: random(-10, 110) + "%",
      top: random(-10, 110) + "%",
      animationDuration: random(3, 8) + "s",
      animationDelay: random(0, 5) + "s",
      opacity: random(0.3, 0.7),
      size: random(2, 6) + "px",
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: "-3rem",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 5,
        maskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 100%)",
      }}
    >
      <style>
        {`
          @keyframes cold-float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-20px) translateX(10px); opacity: 0; }
          }
        `}
      </style>
      
      {/* Subtle frost gradient overlay */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(200, 230, 255, 0.1), transparent 70%)",
          mixBlendMode: "screen",
        }} 
      />

      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: "white",
            borderRadius: "50%",
            boxShadow: "0 0 4px 1px rgba(200, 230, 255, 0.8)",
            opacity: p.opacity,
            animation: `cold-float ${p.animationDuration} ease-in-out infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
