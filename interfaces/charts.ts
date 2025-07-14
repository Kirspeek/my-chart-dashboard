import { CommonComponentProps } from "./common";

export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface LineChartProps extends CommonComponentProps {
  data: Array<{
    month: string;
    sales: number;
    revenue: number;
    profit: number;
  }>;
  title: string;
}

export interface BarChartData {
  name: string;
  sales: number;
  revenue: number;
}

export interface BarChartProps extends CommonComponentProps {
  data: BarChartData[];
  title: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps extends CommonComponentProps {
  data: PieChartData[];
  title: string;
}
