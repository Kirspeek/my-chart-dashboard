import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const NB_DROPS = 60;

function randRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function RainAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No-op, drops are rendered as React elements
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #3a7ca5 0%, #274472 100%)",
      }}
      className="rain-animation"
    >
      {/* Animated cartoon-style gradient rain clouds background (no border) */}
      <motion.div
        initial={{ x: -180 }}
        animate={{ x: 220 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 28,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          opacity: 0.7,
          zIndex: 0,
        }}
      >
        <svg width="260" height="90" viewBox="0 0 260 90" fill="none">
          <defs>
            <linearGradient
              id="cloudGrad1"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientTransform="scale(1,90)"
            >
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#dbe6ef" />
            </linearGradient>
          </defs>
          <path
            d="M60,70 Q40,80 30,60 Q10,50 30,40 Q35,20 60,30 Q70,10 100,20 Q120,5 140,20 Q170,10 180,30 Q210,25 220,50 Q250,55 230,70 Q220,85 200,75 Q180,90 160,80 Q140,95 120,80 Q100,90 80,80 Q60,90 60,70 Z"
            fill="url(#cloudGrad1)"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ x: 200 }}
        animate={{ x: -220 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 36,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          opacity: 0.5,
          zIndex: 0,
        }}
      >
        <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
          <defs>
            <linearGradient
              id="cloudGrad2"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientTransform="scale(1,60)"
            >
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#dbe6ef" />
            </linearGradient>
          </defs>
          <path
            d="M40,45 Q25,55 20,40 Q5,35 20,25 Q25,10 40,15 Q50,0 70,10 Q90,0 110,10 Q130,0 140,15 Q160,10 170,25 Q180,30 170,45 Q160,55 150,45 Q130,60 110,50 Q90,60 70,50 Q50,60 40,45 Z"
            fill="url(#cloudGrad2)"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ x: -120 }}
        animate={{ x: 180 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 24,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          bottom: 12,
          left: 0,
          opacity: 0.4,
          zIndex: 0,
        }}
      >
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
          <defs>
            <linearGradient
              id="cloudGrad3"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientTransform="scale(1,40)"
            >
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#dbe6ef" />
            </linearGradient>
          </defs>
          <path
            d="M20,30 Q10,40 5,25 Q0,20 10,10 Q15,0 30,5 Q40,0 60,10 Q80,0 90,10 Q110,5 115,20 Q120,25 110,35 Q100,40 90,30 Q80,40 60,30 Q40,40 20,30 Z"
            fill="url(#cloudGrad3)"
          />
        </svg>
      </motion.div>
      {/* Rain drops */}
      {Array.from({ length: NB_DROPS }).map((_, i) => {
        const left = randRange(0, 100);
        const delay = Math.random() * 0.7;
        const duration = 0.5 + Math.random() * 0.7;
        const opacity = 0.3 + Math.random() * 0.7;
        return (
          <div
            key={i}
            className="drop"
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${randRange(-100, 0)}%`,
              width: "1px",
              height: `${randRange(40, 89)}px`,
              borderRadius: "1px",
              opacity,
              animation: `fall ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        .drop {
          background: linear-gradient(to bottom, rgba(13,52,58,1) 0%, rgba(255,255,255,0.6) 100%);
        }
        @keyframes fall {
          to { margin-top: 900px; }
        }
      `}</style>
    </div>
  );
}
