import {
  MetricData,
  SalesData,
  UserData,
  BarChartData,
  PieChartData,
} from "../../interfaces";

export const salesData: SalesData[] = [
  { month: "Jan", sales: 1200, revenue: 24000, profit: 8000 },
  { month: "Feb", sales: 1400, revenue: 28000, profit: 9500 },
  { month: "Mar", sales: 1100, revenue: 22000, profit: 7200 },
  { month: "Apr", sales: 1600, revenue: 32000, profit: 11000 },
  { month: "May", sales: 1800, revenue: 36000, profit: 12500 },
  { month: "Jun", sales: 2000, revenue: 40000, profit: 14000 },
  { month: "Jul", sales: 2200, revenue: 44000, profit: 15500 },
  { month: "Aug", sales: 2400, revenue: 48000, profit: 17000 },
  { month: "Sep", sales: 2100, revenue: 42000, profit: 14800 },
  { month: "Oct", sales: 1900, revenue: 38000, profit: 13200 },
  { month: "Nov", sales: 1700, revenue: 34000, profit: 11800 },
  { month: "Dec", sales: 1500, revenue: 30000, profit: 10500 },
];

export const userData: UserData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    lastLogin: "2024-01-14",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    status: "inactive",
    lastLogin: "2024-01-10",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "active",
    lastLogin: "2024-01-13",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "active",
    lastLogin: "2024-01-12",
  },
];

export const metricCards: MetricData[] = [
  {
    title: "Total Sales",
    value: "$456,000",
    change: 12.5,
    icon: "TrendingUp",
  },
  {
    title: "Total Revenue",
    value: "$2.4M",
    change: 8.2,
    icon: "DollarSign",
  },
  {
    title: "Active Users",
    value: "1,234",
    change: -2.1,
    icon: "Users",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: 1.8,
    icon: "Target",
  },
];

export const dashboardStats = {
  totalSales: 456000,
  totalRevenue: 2400000,
  totalUsers: 1234,
  conversionRate: 3.2,
};

export const pieChartData: PieChartData[] = [
  { name: "Desktop", value: 45, color: "#3b82f6" },
  { name: "Mobile", value: 35, color: "#10b981" },
  { name: "Tablet", value: 20, color: "#f59e0b" },
];

export const barChartData: BarChartData[] = [
  { name: "Q1", sales: 1200, revenue: 24000 },
  { name: "Q2", sales: 1800, revenue: 36000 },
  { name: "Q3", sales: 2200, revenue: 44000 },
  { name: "Q4", sales: 1900, revenue: 38000 },
];
