"use client";

import { useEffect, useState } from "react";

export function useTimelineResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        setIsMobile(width <= 425);
        setIsTablet(width > 425 && width <= 1024);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return { isMobile, isTablet };
}
