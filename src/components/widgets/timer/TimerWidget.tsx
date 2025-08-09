"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { TimerWidgetProps } from "../../../../interfaces/components";

export default function TimerWidget({ className = "" }: TimerWidgetProps) {
  return (
    <WidgetBase
      style={{
        width: "100%",
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
      }}
      className={className}
    >
      <div
        style={{
          fontSize: "3rem",
          fontWeight: "700",
          fontStyle: "italic",
          color: "rgb(252, 128, 159)",
          padding: "0.1rem 0.3rem",
          whiteSpace: "nowrap",
          lineHeight: 1,
          overflow: "hidden",
        }}
      >
        Timer Coming Soon!
      </div>
    </WidgetBase>
  );
}
