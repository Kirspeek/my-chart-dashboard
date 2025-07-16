// Export all hooks
export { default as useWeather } from "./useWeather";
export { useApi, useWeatherApi } from "./useApi";
export { useWeatherPreload } from "./useWeatherPreload";
export { useTimerLogic } from "./useTimerLogic";
export { useClockLogic, timeZones } from "./useClockLogic";
export { useWeatherLogic } from "./useWeatherLogic";
export { useMapLogic } from "./useMapLogic";
export { useCalendarLogic } from "./useCalendarLogic";
export { useTheme } from "./useTheme";
export { useMetricLogic } from "./useMetricLogic";

// Re-export common React hooks for convenience
export { useState, useEffect, useCallback, useMemo, useRef } from "react";
