import React from "react";

export const useWavesInteractionLogic = () => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = (onRefresh?: () => void) => {
    setIsLoaded(false);
    setTimeout(() => {
      setIsLoaded(true);
      onRefresh?.();
    }, 100);
  };

  return {
    chartRef,
    isLoaded,
    handleRefresh,
  };
};
