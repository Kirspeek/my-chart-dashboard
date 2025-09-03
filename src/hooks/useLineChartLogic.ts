import { useCallback } from "react";
import type { WidgetLineChartData } from "@/interfaces/widgets";
import type { LineChartMetricsSummary } from "@/interfaces/charts";

export function useLineChartMetrics(data: WidgetLineChartData[]) {
  const calculateMetrics = useCallback((): LineChartMetricsSummary => {
    if (!data.length)
      return {
        sales: 0,
        revenue: 0,
        profit: 0,
        salesGrowth: 0,
        revenueGrowth: 0,
        profitGrowth: 0,
      };

    const latest = data[data.length - 1];
    const previous = data[data.length - 2] || latest;

    const salesGrowth =
      previous.sales > 0
        ? ((latest.sales - previous.sales) / previous.sales) * 100
        : 0;
    const revenueGrowth =
      previous.revenue > 0
        ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
        : 0;
    const profitGrowth =
      previous.profit > 0
        ? ((latest.profit - previous.profit) / previous.profit) * 100
        : 0;

    return {
      sales: latest.sales,
      revenue: latest.revenue,
      profit: latest.profit,
      salesGrowth,
      revenueGrowth,
      profitGrowth,
    };
  }, [data]);

  return { calculateMetrics };
}
