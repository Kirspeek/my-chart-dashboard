"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { TimerWidgetProps } from "../../../../interfaces/components";

export default function TimerWidget({ className = "" }: TimerWidgetProps) {
  return (
    <WidgetBase
      style={{
        width: "100%",
        padding: "2rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
      className={className}
    >
      <div
        style={{
          fontSize: "3.5rem",
          fontWeight: "700",
          fontStyle: "italic",
          color: "rgb(252, 128, 159)",
          padding: "0.3rem",
        }}
      >
        Timer Coming Soon!
      </div>
    </WidgetBase>
  );
}
