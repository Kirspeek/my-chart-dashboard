"use client";

import React from "react";
import SimpleHeader from "./SimpleHeader";
import SlideNavigation from "./SlideNavigation";

interface WidgetLayoutProps {
  title: string;
  children: React.ReactNode;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
  totalSlides?: number;
  headerVariant?: "default" | "centered" | "compact";
  headerSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
  contentClassName?: string;
}

export default function WidgetLayout({
  title,
  children,
  currentSlide,
  setCurrentSlide,
  totalSlides = 17,
  headerVariant = "default",
  headerSize = "md",
  className = "flex flex-col h-full",
  contentClassName = "flex-1 min-h-0 flex flex-col",
}: WidgetLayoutProps) {
  return (
    <div className={className}>
      <SimpleHeader title={title} variant={headerVariant} size={headerSize} />
      <div className={contentClassName}>{children}</div>
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={totalSlides}
        />
      )}
    </div>
  );
}
