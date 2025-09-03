import { ReactNode, HTMLAttributes } from "react";

export interface WidgetBaseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface Button3DProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  customBackground?: string;
  customAccentColor?: string;
}

export interface TimerWidgetProps {
  className?: string;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

// Weather Cache Status Interfaces
export interface WeatherCacheStatusProps {
  cities: string[];
  className?: string;
}

export interface MapComponentProps {
  center: [number, number];
  zoom: number;
  className?: string;
  style?: React.CSSProperties;
}

// Common component props for shared chart UI pieces
export interface ToggleButtonOption {
  key: string;
  // Using any icon component type with className prop
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

export interface ToggleButtonGroupProps {
  options: ToggleButtonOption[];
  selectedKey: string;
  onChange: (key: string) => void;
  size?: "sm" | "md";
  className?: string;
  hideLabelsOnMobile?: boolean;
}

export interface AnalyticsHeaderProps {
  leftTitle: string;
  leftSubtitle?: string;
  rightValueLabel?: string;
  rightValue: string;
  className?: string;
}

export interface SelectionBannerProps {
  label: string;
  value: string;
  onClear: () => void;
  className?: string;
}

export interface MetricStatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  subtitle?: string;
  value: string | number;
  growth?: number; // percentage, can be negative
  color: string; // accent color for the card/icon
  badge?: string;
  progress?: number; // 0-100
  className?: string;
}

export interface InsightsPanelProps {
  title: string;
  show: boolean;
  onToggle: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Line chart header
export interface LineChartHeaderProps {
  title: string;
}

// Bar chart header
export interface BarChartHeaderProps {
  title: string;
}
