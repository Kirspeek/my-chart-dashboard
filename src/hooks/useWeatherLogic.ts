import { useState, useEffect } from "react";
import useWeather from "./useWeather";

export function useWeatherLogic(city: string) {
  const { forecast, error, isCached, isPreloading, stale } = useWeather(city);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today by default
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    if (forecast[selectedDay]) {
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() + selectedDay);
      setDateString(
        date.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }
  }, [forecast, selectedDay]);

  const isCloudy = /cloudy|partly cloudy/i.test(
    forecast[selectedDay]?.desc || ""
  );

  return {
    forecast,
    error,
    isCached,
    isPreloading,
    stale,
    selectedDay,
    dateString,
    isCloudy,
    setSelectedDay,
  };
}
