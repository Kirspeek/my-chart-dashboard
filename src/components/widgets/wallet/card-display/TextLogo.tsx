import React from "react";
import { TextLogoProps } from "../../../../../interfaces/wallet";

export default function TextLogo({ text, color }: TextLogoProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.2)",
        borderRadius: 4,
        padding: "2px 6px",
        minWidth: text === "BANK" ? 40 : 24,
        height: 24,
      }}
    >
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: text === "BANK" ? 10 : 8,
          fontWeight: 700,
          color: color,
          textAlign: "center",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        {text === "BANK" ? "BANK" : text.slice(0, 3).toUpperCase()}
      </div>
    </div>
  );
}
