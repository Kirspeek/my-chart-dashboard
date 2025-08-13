"use client";

import React from "react";

interface SlideNavigationProps {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  totalSlides?: number;
  className?: string;
}

export default function SlideNavigation({
  currentSlide,
  setCurrentSlide,
  totalSlides = 17,
  className = "",
}: SlideNavigationProps) {
  return (
    <div className={`mobile-slide-indicators ${className}`}>
      {/* Previous button */}
      {currentSlide > 0 && (
        <div
          className="mobile-slide-indicator"
          onClick={() => setCurrentSlide(currentSlide - 1)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCurrentSlide(currentSlide - 1);
            }
          }}
          role="button"
          aria-label="Go to previous slide"
          tabIndex={0}
        />
      )}
      {/* Current button (bigger) */}
      <div
        className="mobile-slide-indicator active"
        onClick={() => setCurrentSlide(currentSlide)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setCurrentSlide(currentSlide);
          }
        }}
        role="button"
        aria-label={`Current slide (${currentSlide + 1})`}
        tabIndex={0}
      />
      {/* Next button */}
      {currentSlide < totalSlides - 1 && (
        <div
          className="mobile-slide-indicator"
          onClick={() => setCurrentSlide(currentSlide + 1)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCurrentSlide(currentSlide + 1);
            }
          }}
          role="button"
          aria-label="Go to next slide"
          tabIndex={0}
        />
      )}
    </div>
  );
}
