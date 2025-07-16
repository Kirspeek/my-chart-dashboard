"use client";

import React from "react";
import CloudAnimation from "../animations/CloudAnimation";
import RainAnimation from "../animations/RainAnimation";
import SunAnimation from "../animations/SunAnimation";
import HotAnimation from "../animations/HotAnimation";
import Lightning from "../animations/Lightning";
import FogAnimation from "../animations/FogAnimation";

interface WeatherAnimationsProps {
  weatherDesc: string;
}

export default function WeatherAnimations({
  weatherDesc,
}: WeatherAnimationsProps) {
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
    </>
  );
}
