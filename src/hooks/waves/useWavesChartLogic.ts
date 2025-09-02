import { useMemo } from "react";
import { WavesChartProps } from "@/interfaces/widgets";
import { defaultWavesData } from "@/data/waves";

export const useWavesChartLogic = ({
  data,
  title,
}: {
  data?: WavesChartProps["data"];
  title?: string;
}) => {
  const chartData = useMemo(() => {
    return data && data.length > 0 ? data : defaultWavesData;
  }, [data]);

  const chartTitle = useMemo(() => {
    return title || "Area Chart";
  }, [title]);

  return {
    chartData,
    chartTitle,
  };
};
