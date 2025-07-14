export interface LineChartProps {
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

export interface BarChartProps {
  data: BarChartData[];
  title: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieChartData[];
  title: string;
}
