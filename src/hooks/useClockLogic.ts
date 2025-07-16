import { useEffect, useState, useMemo } from "react";
import type {
  ClockState,
  ClockActions,
  TimeZone,
} from "../../interfaces/widgets";

export const timeZones: TimeZone[] = [
  { label: "New York", zone: "America/New_York", utc: "UTC-5" },
  { label: "London", zone: "Europe/London", utc: "UTC+0" },
  { label: "Rome", zone: "Europe/Rome", utc: "UTC+1" },
  { label: "Kyiv", zone: "Europe/Kyiv", utc: "UTC+2" },
];

export function useClockLogic(selectedZone: string): ClockState & ClockActions {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0); // Used to force re-render every second
  const [is24h, setIs24h] = useState(true);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time only when mounted to prevent hydration mismatch
  const mainTime = useMemo(() => {
    return mounted ? getTimeInZone(selectedZone) : new Date(0);
  }, [mounted, selectedZone, tick]);

  useEffect(() => {
    if (mounted) {
      setDateStr(
        mainTime.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }
  }, [mainTime, mounted]);

  function getTimeInZone(zone: string) {
    return new Date(new Date().toLocaleString("en-US", { timeZone: zone }));
  }

  function isDay(hours: number) {
    return hours >= 6 && hours < 18;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    mounted,
    tick,
    is24h,
    dateStr,
    mainTime,
    setIs24h,
    pad,
    getTimeInZone,
    isDay,
  };
}
