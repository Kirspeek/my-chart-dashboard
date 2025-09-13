export interface AnalyticsViewAnalytics {
  maxValue: number;
  totalDays: number;
  activeDays: number;
  trend: "up" | "down";
  trendPercentage: number;
  avgValue: number;
}

export interface ContributionChartColors {
  primary: string;
  secondary: string;
  muted: string;
  cardBackground: string;
  borderSecondary: string;
  accent: {
    red: string;
    yellow: string;
    teal: string;
    blue: string;
    green?: string;
  };
}

export interface TrendsViewAnalytics {
  maxValue: number;
  totalDays: number;
  activeDays: number;
  trend: "up" | "down";
  trendPercentage: number;
  avgValue: number;
}
