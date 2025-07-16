import { Dispatch, SetStateAction } from "react";
import { CommonComponentProps } from "./common";

// Clock Widget Interfaces
export interface TimeZone {
  label: string;
  zone: string;
  utc: string;
}

export interface ClockState {
  mounted: boolean;
  tick: number;
  is24h: boolean;
  dateStr: string;
  mainTime: Date;
}

export interface ClockActions {
  setIs24h: (is24h: boolean) => void;
  pad: (n: number) => string;
  getTimeInZone: (zone: string) => Date;
  isDay: (hours: number) => boolean;
}

export interface ClockWidgetProps {
  selectedZone: string;
  setSelectedZone: Dispatch<SetStateAction<string>>;
}

// Timer Widget Interfaces
export interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  dragging: boolean;
  previewDuration: number | null;
}

export interface TimerActions {
  toggleTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: number) => void;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onPointerMove: (e: MouseEvent | TouchEvent) => void;
  onPointerUp: () => void;
  formatTime: (seconds: number) => string;
  getSecondsFromPointer: (clientX: number, clientY: number) => number;
}

// Weather Widget Interfaces
export interface WeatherState {
  selectedDay: number;
  dateString: string;
  isCloudy: boolean;
}

export interface WeatherActions {
  setSelectedDay: (day: number) => void;
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
