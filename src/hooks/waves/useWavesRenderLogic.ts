import { useMemo } from "react";
import { WavesChartProps } from "@/interfaces/widgets";

export const useWavesRenderLogic = (
  chartData: NonNullable<WavesChartProps["data"]>
) => {
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
