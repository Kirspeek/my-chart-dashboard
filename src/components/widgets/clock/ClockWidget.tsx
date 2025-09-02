"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { ClockWidgetProps } from "../../../../interfaces/widgets";
import { useClockLogic } from "@/hooks/useClockLogic";
import { timeZones } from "@/constants/timeZones";
import ClockDisplay from "./ClockDisplay";
import WorldClocks from "./WorldClocks";
import "../../../styles/mobile.css";

export default function ClockWidget({
  selectedZone,
  setSelectedZone,
  isMobile = false,
  onOpenSidebar,
  showSidebarButton = false,
}: ClockWidgetProps & {
  isMobile?: boolean;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
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

  if (!mounted) {
    return (
      <WidgetBase
        className="flex flex-col gap-8 clock-widget-mobile"
        style={{
          width: "100%",
          padding: "2.5rem 2.5rem",
        }}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className="font-mono font-extrabold clock-display-mobile"
            style={{
              fontSize: "6rem",
              color: "var(--primary-text)",
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
      className="flex flex-col gap-8 clock-widget-mobile"
      style={{
        width: "100%",
        padding: "2.5rem 2.5rem",
      }}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
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
        pad={pad}
        getTimeInZone={getTimeInZone}
        isDay={isDay}
        isMobile={isMobile}
      />
    </WidgetBase>
  );
}
