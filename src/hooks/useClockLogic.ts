import { useEffect, useState, useMemo } from "react";
import type { ClockState, ClockActions } from "../../interfaces/widgets";

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

  // 'tick' is intentionally included to force re-render every second
  const mainTime = useMemo(() => {
    return mounted ? getTimeInZone(selectedZone) : new Date(0);
  }, [mounted, selectedZone]); // tick is used to force re-render, not as a dependency

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
