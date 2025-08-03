"use client";

import React, { useState } from "react";
import ClockWidget from "../../components/widgets/clock/ClockWidget";
import WeatherWidgetMobile from "../../components/weather/WeatherWidgetMobile";
import "../../styles/mobile.css";

export default function MobileDemoPage() {
  const [selectedZone, setSelectedZone] = useState("Europe/Kyiv");

  return (
    <div className="widget-container-mobile">
      <ClockWidget
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
      />
      <WeatherWidgetMobile city="Kyiv" />
    </div>
  );
}
