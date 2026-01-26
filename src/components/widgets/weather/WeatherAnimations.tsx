"use client";

import React from "react";
import CloudAnimation from "../../animations/CloudAnimation";
import RainAnimation from "../../animations/RainAnimation";
import SunAnimation from "../../animations/SunAnimation";
import HotAnimation from "../../animations/HotAnimation";
import Lightning from "../../animations/Lightning";
import FogAnimation from "../../animations/FogAnimation";

import SnowAnimation from "../../animations/SnowAnimation";
import ColdAnimation from "../../animations/ColdAnimation";

interface WeatherAnimationsProps {
  weatherDesc: string;
  temperature?: number;
}

export default function WeatherAnimations({
  weatherDesc,
  temperature,
}: WeatherAnimationsProps) {
  const isSnowing = /snow/i.test(weatherDesc);
  const isFreezing = temperature !== undefined && temperature <= 0;

  return (
    <>
      {/* Weather-specific animations */}
      {/showers|hot|very hot|heat|accent-red|drizzle/i.test(weatherDesc) && (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 12,
            zIndex: 2,
            width: 90,
            height: 140,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HotAnimation />
        </div>
      )}
      {/clear sky|sunny/i.test(weatherDesc) && <SunAnimation />}
      {/partly cloudy/i.test(weatherDesc) && <CloudAnimation />}
      {/rain/i.test(weatherDesc) && <RainAnimation />}
      {/thunderstorm/i.test(weatherDesc) && <Lightning />}
      {/fog/i.test(weatherDesc) && <FogAnimation />}
      {isSnowing && <SnowAnimation />}
      
      {/* Cold weather animation (frost) if freezing and NOT snowing */}
      {isFreezing && !isSnowing && <ColdAnimation />}
    </>
  );
}
