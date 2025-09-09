import type { ReactNode } from "react";

export interface MetricCardData {
  title: string;
  value: string;
  change: number;
  icon: string;
}

export interface RadarChartDataItem {
  subject: string;
  value: number;
  fullMark: number;
}

export interface SankeyChartDataItem {
  from: string;
  to: string;
  size: number;
}

export interface BubbleChartDataItem {
  x: number;
  y: number;
  size: number;
  category: string;
  label: string;
}

export interface DashboardData {
  metricCards?: MetricCardData[];
  salesData?: Array<{
    month: string;
    sales: number;
    revenue: number;
    profit: number;
  }>;
  barChartData?: Array<{ name: string; sales: number; revenue: number }>;
  pieChartData?: Array<{ name: string; value: number; color: string }>;
  userData?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
  }>;
  radarChartData?: RadarChartDataItem[];
  migrationData?: SankeyChartDataItem[];
  sankeyData?: SankeyChartDataItem[];
  bubbleData?: BubbleChartDataItem[];
  performanceMetricsData?: { currentMetrics: RadarChartDataItem[] };
}

export interface AppShellProps {
  children: ReactNode;
}
