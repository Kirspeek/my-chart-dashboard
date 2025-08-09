import React from "react";
import { ExpenseData } from "../../../interfaces/widgets";
import Button from "./Button";

interface BottomSegmentInfoProps {
  segment: ExpenseData | null;
}

function getReadableTextColor(bg: string): string {
  // Supports hex #rrggbb or rgb(a)
  let r = 35,
    g = 35,
    b = 35;
  const hexMatch = bg.trim().match(/^#([0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    const rgbMatch = bg.trim().match(/^rgba?\(([^)]+)\)$/);
    if (rgbMatch) {
      const parts = rgbMatch[1].split(",").map((p) => parseFloat(p.trim()));
      r = parts[0] ?? r;
      g = parts[1] ?? g;
      b = parts[2] ?? b;
    }
  }
  // Relative luminance
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  // Choose dark text for light backgrounds; light text for dark backgrounds
  return luminance > 0.5 ? "#232323" : "#ffffff";
}

export default function BottomSegmentInfo({ segment }: BottomSegmentInfoProps) {
  if (!segment) return null;

  const bgColor = segment.color;
  const textColor = getReadableTextColor(bgColor);

  return (
    <div className="mb-2 flex items-center justify-center">
      <Button
        title={`${segment.name} ${segment.percentage}%`}
        style={{
          minWidth: "auto",
          height: 32,
          padding: "0 12px",
          borderRadius: 10,
          background: bgColor,
          color: textColor,
          border: `1px solid rgba(0,0,0,${textColor === "#ffffff" ? 0.15 : 0.08})`,
          boxShadow:
            textColor === "#ffffff"
              ? "0 8px 14px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <span className="text-sm font-semibold tracking-tight">
          {segment.name} {segment.percentage}%
        </span>
      </Button>
    </div>
  );
}
