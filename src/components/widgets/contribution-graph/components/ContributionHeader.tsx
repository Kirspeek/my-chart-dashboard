import React from "react";

interface ContributionHeaderProps {
  title: string;
  totalYearSpending: number;
  averageDailySpending: number;
  colors: {
    primary: string;
    secondary: string;
  };
}

export default function ContributionHeader({
  title,
  totalYearSpending,
  averageDailySpending,
  colors,
}: ContributionHeaderProps) {
  // Detect mobile for spacing adjustments
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      className="text-center"
      style={{
        marginTop: isMobile ? "1rem" : undefined,
        marginBottom: isMobile ? "0.1rem" : 4,
      }}
    >
      <h3
        className="text-lg font-semibold mb-2"
        style={{
          color: colors.primary,
          fontFamily: "var(--font-mono)",
          fontWeight: 900,
          letterSpacing: "0.01em",
          fontSize: isMobile ? "0.8rem" : "",
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm mt-1"
        style={{
          color: colors.secondary,
          fontFamily: "var(--font-sans)",
          opacity: 0.8,
          letterSpacing: "0.01em",
          fontSize: isMobile ? "0.6rem" : "",
        }}
      >
        Total: ${totalYearSpending.toLocaleString()} | Avg: $
        {averageDailySpending}/day
      </p>
    </div>
  );
}
