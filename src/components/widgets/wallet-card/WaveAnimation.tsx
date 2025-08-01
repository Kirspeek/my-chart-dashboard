"use client";

import React, { useEffect, useState } from "react";
import styles from "./WaveAnimation.module.css";

interface WaveAnimationProps {
  data: {
    name: string;
    value: number;
    color: string;
    percentage: number;
  }[];
  isAnimating: boolean;
}

interface Wave {
  id: number;
  color: string;
  height: number;
  delay: number;
  opacity: number;
  offset: number;
}

export default function WaveAnimation({
  data,
  isAnimating,
}: WaveAnimationProps) {
  const [waves, setWaves] = useState<Wave[]>([]);

  useEffect(() => {
    // Create 4 waves with different properties for overlapping effect
    const waveData: Wave[] = data.slice(0, 4).map((item, index) => ({
      id: index,
      color: item.color,
      height: isAnimating ? 70 : item.percentage, // Animate to 70% then settle to actual percentage
      delay: index * 0.3, // Stagger the waves
      opacity: 0.4 + index * 0.15, // Different opacity for each wave
      offset: index * 20, // Horizontal offset for overlapping
    }));

    setWaves(waveData);
  }, [data, isAnimating]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {waves.map((wave) => (
        <div
          key={wave.id}
          className={styles["wave-container"]}
          style={{
            height: `${wave.height}%`,
            zIndex: wave.id,
            left: `${wave.offset}px`,
          }}
        >
          <div
            className={`${styles.wave} ${isAnimating ? styles.animating : ""}`}
            style={{
              backgroundColor: wave.color,
              opacity: wave.opacity,
              animationDelay: `${wave.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
