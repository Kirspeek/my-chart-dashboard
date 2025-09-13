import type { PerformanceMetricsData } from "./widgets";

export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface SalesData {
  month: string;
  sales: number;
  revenue: number;
  profit: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: string;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalUsers: number;
  conversionRate: number;
}

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

export interface BarChartDataItem {
  name: string;
  sales: number;
  revenue: number;
}

export interface PieChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  metricCards?: MetricCardData[];
  salesData?: SalesData[];
  barChartData?: BarChartDataItem[];
  pieChartData?: PieChartDataItem[];
  userData?: UserData[];
  radarChartData?: RadarChartDataItem[];
  migrationData?: SankeyChartDataItem[];
  sankeyData?: SankeyChartDataItem[];
  bubbleData?: BubbleChartDataItem[];
  performanceMetricsData?: PerformanceMetricsData;
}

export interface CityMap {
  [key: string]: string;
}
