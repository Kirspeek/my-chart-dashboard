import React from "react";
import { PocketContainerProps } from "@/interfaces/wallet";

export default function PocketContainer({
  width,
  height,
  zIndex = 10,
}: PocketContainerProps) {
  return (
    <div
      style={
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: width,
          height: height,
          background: "rgba(var(--background-rgb), 0.65)",
          borderRadius: "0 0 32px 32px",
          boxShadow:
            "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)",
          border: "2px solid rgba(0,0,0,0.06)",
          borderTop: "none",
          borderBottom: "2px solid rgba(0,0,0,0.06)",
          borderLeft: "2px solid rgba(0,0,0,0.06)",
          borderRight: "2px solid rgba(0,0,0,0.06)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: zIndex,
          "--r": "40px",
          "--s": "140px",
          "--a": "50deg",
          "--p": "50%",
          "--_m": "var(--r),#000 calc(100% - 1px),#0000",
          "--_d": "(var(--s) + var(--r))*cos(var(--a))",
          mask: `
          radial-gradient(var(--r) at calc(var(--p) + var(--_d)) var(--_m)),
          radial-gradient(var(--r) at calc(var(--p) - var(--_d)) var(--_m)),
          radial-gradient(var(--s) at var(--p) calc(-1*sin(var(--a))*var(--s)), #0000 100%,#000 calc(100% + 1px)) 0 calc(var(--r)*(1 - sin(var(--a)))) no-repeat,
          linear-gradient(90deg,#000 calc(var(--p) - var(--_d)),#0000 0 calc(var(--p) + var(--_d)),#000 0)
        `,
          WebkitMask: `
          radial-gradient(var(--r) at calc(var(--p) + var(--_d)) var(--_m)),
          radial-gradient(var(--r) at calc(var(--p) - var(--_d)) var(--_m)),
          radial-gradient(var(--s) at var(--p) calc(-1*sin(var(--a))*var(--s)), #0000 100%,#000 calc(100% + 1px)) 0 calc(var(--r)*(1 - sin(var(--a)))) no-repeat,
          linear-gradient(90deg,#000 calc(var(--p) - var(--_d)),#0000 0 calc(var(--p) + var(--_d)),#000 0)
        `,
        } as React.CSSProperties & {
          "--r": string;
          "--s": string;
          "--a": string;
          "--p": string;
          "--_m": string;
          "--_d": string;
        }
      }
    />
  );
}
