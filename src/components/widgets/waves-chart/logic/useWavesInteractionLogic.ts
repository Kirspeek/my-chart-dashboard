import { useState, useRef, useCallback, useEffect } from "react";

export const useWavesInteractionLogic = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize loading state
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle refresh functionality
  const handleRefresh = useCallback((onRefresh?: () => void) => {
    setIsLoaded(false);
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    onRefresh?.();
  }, []);

  return {
    chartRef,
    isLoaded,
    handleRefresh,
  };
};
