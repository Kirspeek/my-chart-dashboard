import { useMemo } from "react";
import { WaveData } from "../../../../../interfaces/charts";

export const useWavesRenderLogic = (chartData: WaveData[]) => {
  // Generate wave paths in reversed order so the last dataset renders at the bottom
  const wavePaths = useMemo(() => {
    const datasetsInRenderOrder = [...chartData].reverse();
    return datasetsInRenderOrder.map((dataset, index) => ({
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
