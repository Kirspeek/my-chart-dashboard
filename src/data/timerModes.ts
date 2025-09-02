import { TIMER_DURATIONS } from "./timer";

export type TimerModeId = "pomodoro" | "short-break" | "long-break" | "quick";

export interface TimerModeData {
  id: TimerModeId;
  name: string;
  duration: number;
}

export const TIMER_MODES: TimerModeData[] = [
  { id: "pomodoro", name: "Focus", duration: TIMER_DURATIONS.focus },
  { id: "short-break", name: "Break", duration: TIMER_DURATIONS.break },
  { id: "long-break", name: "Rest", duration: TIMER_DURATIONS.rest },
  { id: "quick", name: "Quick", duration: TIMER_DURATIONS.quick },
];
