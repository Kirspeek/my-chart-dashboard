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
