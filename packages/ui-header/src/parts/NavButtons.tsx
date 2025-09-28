import React from "react";
import type { SectionKey } from "../types";

export type NavButtonsProps = {
  sections: SectionKey[];
  activeSection: SectionKey;
  onSelect: (key: SectionKey) => void;
  labelMap: Map<SectionKey, string>;
  getSectionHref?: (section: SectionKey) => string | undefined;
  color: string;
  borderWidth: number;
  textSizeClass: string;
  paddingClass: string;
  className?: string;
};

export default function NavButtons({
  sections,
  activeSection,
  onSelect,
  labelMap,
  getSectionHref,
  color,
  borderWidth,
  textSizeClass,
  paddingClass,
  className,
}: NavButtonsProps) {
  return (
    <div className={className}>
      {sections
        .filter((k) => k !== activeSection)
        .map((key) =>
          getSectionHref ? (
            <a
              key={key}
              href={getSectionHref(key)}
              className={`widget-button rounded-full ${paddingClass} ${textSizeClass}`}
              style={{
                fontWeight: 700,
                letterSpacing: "0.01em",
                border: `${borderWidth}px solid ${color}`,
                color,
                background: "transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={(e) => {
                const href = getSectionHref(key);
                if (!href) {
                  e.preventDefault();
                  onSelect(key);
                }
              }}
            >
              {labelMap.get(key) ?? key}
            </a>
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`widget-button rounded-full ${paddingClass} ${textSizeClass}`}
              style={{
                fontWeight: 700,
                letterSpacing: "0.01em",
                border: `${borderWidth}px solid ${color}`,
                color,
                background: "transparent",
              }}
            >
              {labelMap.get(key) ?? key}
            </button>
          )
        )}
    </div>
  );
}
