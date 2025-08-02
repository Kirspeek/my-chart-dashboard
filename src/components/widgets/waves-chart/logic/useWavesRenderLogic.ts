import { useMemo } from "react";
import { WaveData } from "./useWavesChartLogic";

export const useWavesRenderLogic = (chartData: WaveData[]) => {
  // Generate wave paths
  const wavePaths = useMemo(() => {
    return chartData.map((dataset, index) => ({
      id: dataset.id,
      className: "dataset",
      path: dataset.path,
      color: dataset.color,
      animationDelay: `${index * 0.1}s`,
    }));
  }, [chartData]);

  return {
    wavePaths,
  };
};
