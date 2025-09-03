import { useCallback } from "react";
import type { WidgetBarChartData } from "@/interfaces/widgets";
import type { BarChartMetricsSummary } from "@/interfaces/charts";

export function useBarChartMetrics(data: WidgetBarChartData[]) {
  const calculateMetrics = useCallback((): BarChartMetricsSummary => {
    if (!data.length)
      return {
        totalRevenue: 0,
        totalSales: 0,
        avgRevenue: 0,
        avgSales: 0,
        growth: 0,
      };

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
    const avgRevenue = totalRevenue / data.length;
    const avgSales = totalSales / data.length;
    const q1Revenue = data[0]?.revenue || 0;
    const q4Revenue = data[data.length - 1]?.revenue || 0;
    const growth =
      q1Revenue > 0 ? ((q4Revenue - q1Revenue) / q1Revenue) * 100 : 0;

    return { totalRevenue, totalSales, avgRevenue, avgSales, growth };
  }, [data]);

  return { calculateMetrics };
}
