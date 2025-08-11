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
        setIsMobile(window.innerWidth <= 425);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Modern glassy, alive effect
  const bg = "rgba(var(--background-rgb), 0.65)";
  const border = "rgba(0,0,0,0.06)";
  // Stronger, more 3D shadow
  const shadow =
    "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)";

  return (
    <div
      className={`rounded-[2.5rem] border p-8 relative ${className}`}
      style={{
        background: bg,
        borderColor: border,
        boxShadow: shadow,
        borderWidth: 2,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...style,
      }}
      {...props}
    >
      {/* Hamburger menu button - only visible on mobile and when showSidebarButton is true */}
      {isMobile && onOpenSidebar && showSidebarButton && (
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
