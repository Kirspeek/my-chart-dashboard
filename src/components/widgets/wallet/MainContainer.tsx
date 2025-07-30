import React from "react";
import { MainContainerProps } from "../../../../interfaces/wallet";

export default function MainContainer({
  width,
  height,
  zIndex = 1,
  children,
}: MainContainerProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        background: "rgba(var(--background-rgb), 0.65)",
        borderRadius: "32px 32px 32px 32px",
        boxShadow:
          "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)",
        border: "2px solid rgba(0,0,0,0.06)",
        borderBottom: "2px solid rgba(0,0,0,0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: zIndex,
      }}
    >
      {children}
    </div>
  );
}
