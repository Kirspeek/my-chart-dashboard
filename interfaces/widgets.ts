import { Dispatch, SetStateAction } from "react";
import { CommonComponentProps } from "./common";

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

export interface ForecastDayProps extends CommonComponentProps {
  day: string;
  icon: string;
  min: number;
  max: number;
  selected: boolean;
  desc: string;
  onClick?: () => void;
}

export interface WeatherBackgroundProps extends CommonComponentProps {
  desc: string;
}

export interface WeatherTextProps extends CommonComponentProps {
  desc: string;
  temp: number;
  city: string;
  date: string;
  hot?: boolean;
}

export interface MetricCardProps extends CommonComponentProps {
  metric: {
    title: string;
    value: string | number;
    change: number;
    changeType: "increase" | "decrease";
    icon: string;
  };
  index?: number;
}
