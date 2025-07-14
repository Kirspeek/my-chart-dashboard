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
  status: "active" | "inactive";
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
