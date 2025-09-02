import { AlertTriangle } from "lucide-react";

export type AccentPalette = Record<string, string> & {
  blue?: string;
  red?: string;
  teal?: string;
  yellow?: string;
};

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export function buildWavesDataFromChart(
  chartData: ChartDatum[],
  accent: AccentPalette
): Array<{ id: string; color: string; path: string; scaleY?: number }> {
  if (!chartData || chartData.length === 0) return [];

  return [
    {
      id: "dataset-1",
      color: accent.teal as string,
      path:
        chartData[0]?.color === (accent.red as string)
          ? "M0,260 C140,230 200,160 280,85 S420,230 560,260 L560,260 L0,260 Z"
          : "M0,260 C80,230 140,210 200,220 C260,230 340,160 420,130 C500,120 540,200 555,235 S560,260 560,260 L0,260 Z",
    },
    {
      id: "dataset-2",
      color: accent.teal as string,
      path:
        chartData[1]?.color === (accent.red as string)
          ? "M0,260 C140,230 200,160 280,85 S420,230 560,260 L560,260 L0,260 Z"
          : "M0,260 C60,180 140,150 220,160 C300,175 360,220 420,200 C480,190 520,235 560,245 C545,255 552,258 560,260 L0,260 Z",
    },
    {
      id: "dataset-3",
      color: accent.teal as string,
      path:
        chartData[2]?.color === (accent.red as string)
          ? "M0,260 C140,230 200,160 280,85 S420,230 560,260 L560,260 L0,260 Z"
          : "M0,260 C70,220 150,200 230,190 C310,180 370,205 440,185 C500,175 540,220 520,232 C556,276 564,265 550,280 L0,260 Z",
    },
  ];
}

export function computeWavesInsights(chartData: ChartDatum[]) {
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const avg = total / (chartData.length || 1);
  const maxCategory = chartData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    chartData[0]
  );
  const minCategory = chartData.reduce(
    (min, item) => (item.value < min.value ? item : min),
    chartData[0]
  );

  const alerts = [
    {
      type: "warning" as const,
      message: "Food spending 15% above average",
      icon: AlertTriangle,
    },
    {
      type: "info" as const,
      message: "Transport costs trending down",
      icon: AlertTriangle,
    },
    {
      type: "success" as const,
      message: "Utilities within budget",
      icon: AlertTriangle,
    },
  ];

  return {
    total,
    avg,
    maxCategory,
    minCategory,
    trend: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
    trendPercentage: Math.floor(Math.random() * 20) + 1,
    alerts,
  };
}
