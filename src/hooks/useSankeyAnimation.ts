"use client";

import { useEffect, useState } from "react";

export function useSankeyAnimation(
  isPlaying: boolean,
  speed: "slow" | "normal" | "fast"
) {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const speedMultiplier = { slow: 0.5, normal: 1, fast: 2 }[speed];
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % 360);
    }, 50 / speedMultiplier);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return { animationFrame, setAnimationFrame } as const;
}
