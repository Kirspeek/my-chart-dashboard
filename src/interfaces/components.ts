import React from "react";

export interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export interface InsightsPanelProps {
  title: string;
  show: boolean;
  onToggle: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface MetricStatCardProps {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  subtitle?: string;
  value: string;
  growth?: number;
  color: string;
  badge?: string;
  progress?: number;
  className?: string;
}

export interface AnalyticsHeaderProps {
  leftTitle: string;
  leftSubtitle?: string;
  rightValue: string;
  rightValueLabel?: string;
  className?: string;
}

export interface SelectionBannerProps {
  label: string;
  value: string;
  onClear: () => void;
  className?: string;
}

export interface ToggleButtonGroupProps {
  options: Array<{
    key: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }>;
  selectedKey: string;
  onChange: (key: string) => void;
  size?: "sm" | "md";
  className?: string;
  hideLabelsOnMobile?: boolean;
}

export interface BarChartHeaderProps {
  title: string;
}

export interface DeviceUsageHeaderProps {
  title: string;
}

export interface LineChartHeaderProps {
  title: string;
}

export interface RecentUsersHeaderProps {
  title: string;
}

export interface MigrationFlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  tooltip?: boolean;
  tooltipTitle?: string;
  tooltipSubtitle?: string;
}

export interface WeatherCacheStatusProps {
  cities: string[];
  className?: string;
}
