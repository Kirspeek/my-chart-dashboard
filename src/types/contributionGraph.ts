export type ContributionChartColors = {
  primary: string;
  secondary: string;
  muted: string;
  cardBackground: string;
  borderSecondary: string;
  accent: {
    blue: string;
    yellow: string;
    red: string;
    teal: string;
  };
};

export type AnalyticsViewAnalytics = {
  maxValue: number;
  avgValue: number;
  totalDays: number;
  activeDays: number;
  trend: "up" | "down";
  trendPercentage: number;
};

export type TrendsViewAnalytics = {
  maxValue: number;
  avgValue: number;
  activeDays: number;
  trend: "up" | "down";
  trendPercentage: number;
};
