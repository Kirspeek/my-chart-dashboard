import { ReactNode, CSSProperties } from "react";

export interface AnimationProps {
  className?: string;
  style?: CSSProperties;
  duration?: number;
  delay?: number;
  repeat?: number | "infinite";
  ease?: string;
}

export interface LightningProps extends AnimationProps {
  hue?: number; // yellow default
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

export interface HotWeatherBackgroundProps extends AnimationProps {
  children: ReactNode;
  inset?: boolean;
}

export interface HotCloudSVGProps {
  style?: CSSProperties;
}
