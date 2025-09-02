export const TIMER_DURATIONS = {
  focus: 25 * 60,
  break: 5 * 60,
  rest: 15 * 60,
  quick: 2 * 60,
} as const;

export const TIMER_LIMITS = {
  minSeconds: 10,
  maxSeconds: 60 * 60,
} as const;

export const TIMER_NOTIFICATION = {
  title: "Timer Complete!",
  icon: "/favicon.ico",
} as const;
