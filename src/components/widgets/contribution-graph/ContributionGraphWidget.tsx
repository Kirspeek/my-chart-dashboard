"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import ContributionGraph from "./ContributionGraph";

interface ContributionGraphWidgetProps {
  title?: string;
}

export default function ContributionGraphWidget({
  title,
}: ContributionGraphWidgetProps) {
  // Detect mobile to apply full-screen sizing
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
    <WidgetBase
      className={`w-full flex flex-col p-6 items-center justify-center ${isMobile ? "contribution-graph-widget" : ""}`}
      style={{
        width: isMobile ? "100vw" : undefined,
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
    >
      <ContributionGraph title={title} />
    </WidgetBase>
  );
}
