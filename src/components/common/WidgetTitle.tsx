"use client";

import React from "react";

interface WidgetTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  variant?: "default" | "centered" | "compact";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function WidgetTitle({
  title,
  subtitle,
  className = "",
  variant = "default",
  size = "md",
}: WidgetTitleProps) {
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

  // Size classes for different screen sizes
  const sizeClasses = {
    sm: {
      mobile: "text-sm",
      tablet: "text-base",
      desktop: "text-lg",
    },
    md: {
      mobile: "text-base",
      tablet: "text-lg",
      desktop: "text-xl",
    },
    lg: {
      mobile: "text-lg",
      tablet: "text-xl",
      desktop: "text-2xl",
    },
    xl: {
      mobile: "text-xl",
      tablet: "text-2xl",
      desktop: "text-3xl",
    },
  };

  // Variant classes for different positioning
  const variantClasses = {
    default: "text-center", // All titles are now centered
    centered: "text-center",
    compact: "text-center mb-2",
  };

  // Get appropriate size class based on screen size
  const getSizeClass = () => {
    if (isMobile) return sizeClasses[size].mobile;
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      return sizeClasses[size].tablet;
    }
    return sizeClasses[size].desktop;
  };

  // Base margin bottom - responsive
  const getMarginBottom = () => {
    if (variant === "compact") return "mb-2";
    if (isMobile) return "mb-3";
    return "mb-4";
  };

  // Mobile top margin
  const getMobileTopMargin = () => {
    if (isMobile) return "mt-2"; // Add more space on top for mobile
    return "";
  };

  return (
    <div className={`${className}`}>
      <h3
        className={`
          font-semibold
          ${getSizeClass()}
          ${variantClasses[variant]}
          ${getMarginBottom()}
          ${getMobileTopMargin()}
          primary-text
        `}
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 900,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          className={`
            text-sm secondary-text text-center mb-4
            ${isMobile ? "mt-1" : "mt-2"}
          `}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
