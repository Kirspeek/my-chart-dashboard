import { Dispatch, SetStateAction } from "react";

export interface ClockWidgetProps {
  selectedZone: string;
  setSelectedZone: Dispatch<SetStateAction<string>>;
}

export interface WeatherWidgetProps {
  city?: string;
}

export interface ForecastDay {
  day: string;
  icon: string;
  min: number;
  max: number;
  desc: string;
}

export interface ForecastDayProps {
  day: string;
  icon: string;
  min: number;
  max: number;
  selected: boolean;
  desc: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface WeatherBackgroundProps {
  desc: string;
  children: React.ReactNode;
}

export interface WeatherTextProps {
  desc: string;
  temp: number;
  city: string;
  date: string;
  hot?: boolean;
  children?: React.ReactNode;
}

export interface MetricCardProps {
  metric: {
    title: string;
    value: string | number;
    change: number;
    changeType: "increase" | "decrease";
    icon: string;
  };
  index?: number;
}
