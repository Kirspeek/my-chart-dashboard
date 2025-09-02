import React from "react";
import { ValueRange } from "@/interfaces/charts";

interface ContributionLegendProps {
  valueRanges: ValueRange[];
  colors: {
    secondary: string;
  };
}

export default function ContributionLegend({
  valueRanges,
  colors,
}: ContributionLegendProps) {
  // Detect mobile for font size adjustments
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="flex items-center justify-between mt-4">
      <div
        className="text-xs"
        style={{
          color: colors.secondary,
          fontFamily: "var(--font-sans)",
          opacity: 0.8,
          letterSpacing: "0.01em",
          fontSize: isMobile ? "0.5rem" : "",
        }}
      >
        Daily activity levels (updates every 5 seconds)
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-xs"
          style={{
            color: colors.secondary,
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.01em",
            fontSize: isMobile ? "0.5rem" : "",
          }}
        >
          Less
        </span>
        {valueRanges.map((range, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: range.color,
              border: `1px solid ${range.color}`,
            }}
            title={`${range.label}`}
          />
        ))}
        <span
          className="text-xs"
          style={{
            color: colors.secondary,
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.01em",
            fontSize: isMobile ? "0.5rem" : "",
          }}
        >
          More
        </span>
      </div>
    </div>
  );
}
