import React, { useMemo } from "react";

// Wave data interface
export interface WaveData {
  id: string;
  color: string;
  path: string;
  scaleY?: number;
}

export interface WavesChartLogicProps {
  data?: WaveData[];
  title?: string;
}

// Default datasets moved outside the hook to avoid dependency issues
const defaultData: WaveData[] = [
  {
    id: "dataset-1",
    color: "#FDE047",
    path: "M0,260 C0,260 22,199 64,199 C105,199 112,144 154,144 C195,144 194,126 216,126 C237,126 263,184 314,184 C365,183 386,128 434,129 C483,130 511,240 560,260 L0,260 Z",
  },
  {
    id: "dataset-2",
    color: "#3B82F6",
    path: "M0,260 C35,254 63,124 88,124 C114,124 148,163 219,163 C290,163 315,100 359,100 C402,100 520,244 560,259 C560,259 0,259 0,260 Z",
  },
  {
    id: "dataset-3",
    color: "#EF4444",
    path: "M0,260 C0,260 12,268 20,268 C90,268 120,40 190,40 C260,40 280,92 318,82 C338,82 356,36 376,36 C396,36 416,86 446,86 C476,86 466,58 486,58 C506,58 526,186 560,260 L0,259 Z",
  },
];

export const useWavesChartLogic = ({ data, title }: WavesChartLogicProps) => {
  const chartData = useMemo(() => {
    return data && data.length > 0 ? data : defaultData;
  }, [data]);

  const chartTitle = useMemo(() => {
    return title || "Area Chart";
  }, [title]);

  return {
    chartData,
    chartTitle,
  };
};

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
