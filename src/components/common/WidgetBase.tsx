"use client";

import { WidgetBaseProps } from "../../../interfaces/components";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function WidgetBase({
  children,
  className = "",
  style = {},
  onOpenSidebar,
  showSidebarButton = false,
  ...props
}: WidgetBaseProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        // Use 425px to match the main page mobile detection (phones only, not tablets)
        const mobile = window.innerWidth <= 425;
        setIsMobile(mobile);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`rounded-[2.5rem] border p-8 relative widget-base ${className}`}
      style={{
        background: "var(--widget-bg)",
        borderColor: "var(--widget-border)",
        boxShadow:
          "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)",
        borderWidth: 2,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...style,
      }}
      {...props}
    >
      {/* Hamburger menu button - only visible on mobile and when showSidebarButton is true */}
      {isMobile && showSidebarButton && onOpenSidebar && (
        <button
          className="absolute top-3 left-3 z-10 p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          type="button"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}
