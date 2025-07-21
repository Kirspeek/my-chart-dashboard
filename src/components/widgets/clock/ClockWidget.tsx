"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { ClockWidgetProps } from "../../../../interfaces/widgets";
import { useClockLogic } from "src/hooks/useClockLogic";
import { timeZones } from "src/constants/timeZones";
import ClockDisplay from "./ClockDisplay";
import WorldClocks from "./WorldClocks";

export default function ClockWidget({
  selectedZone,
  setSelectedZone,
}: ClockWidgetProps) {
  const {
    mounted,
    is24h,
    dateStr,
    mainTime,
    setIs24h,
    pad,
    getTimeInZone,
    isDay,
  } = useClockLogic(selectedZone);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <WidgetBase
        className="flex flex-col gap-8"
        style={{
          width: "100%",
          padding: "2.5rem 2.5rem",
        }}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className="font-mono font-extrabold"
            style={{
              fontSize: "6rem",
              color: "#232323", // light theme primary
              letterSpacing: "0.04em",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            --:--:--
          </div>
        </div>
      </WidgetBase>
    );
  }

  return (
    <WidgetBase
      className="flex flex-col gap-8"
      style={{
        width: "100%",
        padding: "2.5rem 2.5rem",
      }}
    >
      <ClockDisplay
        mainTime={mainTime}
        is24h={is24h}
        dateStr={dateStr}
        pad={pad}
        setIs24h={setIs24h}
      />
      <WorldClocks
        timeZones={timeZones}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        mounted={mounted}
        is24h={is24h}
        pad={pad}
        getTimeInZone={getTimeInZone}
        isDay={isDay}
      />
    </WidgetBase>
  );
}
