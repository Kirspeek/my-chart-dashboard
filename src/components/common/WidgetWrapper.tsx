"use client";

import React from "react";
import WidgetBase from "./WidgetBase";
import SlideNavigation from "./SlideNavigation";
import { useMobileDetection } from "@/hooks/useMobileDetection";

interface WidgetWrapperProps {
  children: React.ReactNode;
  title: string;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
  totalSlides?: number;
  mobileClassName?: string;
  mobileStyle?: React.CSSProperties;
  className?: string;
}

export default function WidgetWrapper({
  children,
  title,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
  totalSlides = 17,
  mobileClassName = "",
  mobileStyle = {},
  className = "flex flex-col",
}: WidgetWrapperProps) {
  const isMobile = useMobileDetection();

  const defaultMobileStyle: React.CSSProperties = {
    width: isMobile ? "100vw" : undefined,
    height: isMobile ? "82vh" : undefined,
    padding: isMobile ? "1rem" : undefined,
    borderRadius: isMobile ? "2rem" : undefined,
    ...mobileStyle,
  };

  return (
    <WidgetBase
      className={`${className} ${isMobile ? mobileClassName : ""}`}
      style={defaultMobileStyle}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={totalSlides}
        />
      )}
    </WidgetBase>
  );
}
