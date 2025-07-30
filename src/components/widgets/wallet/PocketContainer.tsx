import React from "react";
import { PocketContainerProps } from "../../../../interfaces/wallet";

export default function PocketContainer({
  width,
  height,
  zIndex = 10,
}: PocketContainerProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: width,
        height: height,
        background: "rgba(var(--background-rgb), 0.65)",
        borderRadius: "32px 32px 32px 32px", // Normal border radius
        boxShadow:
          "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)",
        border: "none", // Remove border to make it seamless
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: zIndex,
        // CSS mask for smooth curved cut-out
        mask: `
          radial-gradient(30px at calc(50% + 60px), transparent 30px, #000 30px),
          radial-gradient(30px at calc(50% - 60px), transparent 30px, #000 30px),
          radial-gradient(60px at 50% 40px, transparent 60px, #000 60px) 0 0 no-repeat,
          linear-gradient(90deg, #000 calc(50% - 60px), transparent calc(50% - 60px) calc(50% + 60px), #000 calc(50% + 60px))
        `,
        WebkitMask: `
          radial-gradient(30px at calc(50% + 60px), transparent 30px, #000 30px),
          radial-gradient(30px at calc(50% - 60px), transparent 30px, #000 30px),
          radial-gradient(60px at 50% 40px, transparent 60px, #000 60px) 0 0 no-repeat,
          linear-gradient(90deg, #000 calc(50% - 60px), transparent calc(50% - 60px) calc(50% + 60px), #000 calc(50% + 60px))
        `,
      }}
    />
  );
}
