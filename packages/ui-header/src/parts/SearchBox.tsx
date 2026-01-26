import React from "react";
import { Search } from "lucide-react";

export type SearchBoxProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  isVisible: boolean;
  setVisible: (next: boolean) => void;
  isOpen: boolean;
  setOpen: (next: boolean) => void;
  renderResults?: (
    value: string,
    isMobile: boolean,
    close: () => void
  ) => React.ReactNode;
  isMobile: boolean;
  color: string;
  stroke: number;
  searchRef: React.RefObject<HTMLDivElement | null>;
};

export default function SearchBox({
  value,
  onChange,
  placeholder,
  isVisible,
  setVisible,
  isOpen,
  setOpen,
  renderResults,
  isMobile,
  color,
  stroke,
  searchRef,
}: SearchBoxProps) {
  return (
    <div
      className="relative flex items-center"
      ref={searchRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        if (!value) setVisible(false);
      }}
    >
      <a
        role="button"
        aria-label="Open search"
        onClick={() => setVisible(true)}
        title="Search"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Search size={isMobile ? 22 : 28} color={color} strokeWidth={stroke} />
      </a>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => {
          setVisible(true);
          setOpen(value.length > 0);
        }}
        onBlur={() => {
          if (!value) setVisible(false);
        }}
        placeholder={placeholder}
        className="search-mono-input search-input-enhanced"
        style={{
          borderRadius: "1rem",
          padding: isVisible ? "0.5rem 0.9rem" : "0 0",
          width: isVisible ? 220 : 0,
          opacity: isVisible ? 1 : 0,
          marginLeft: isVisible ? 16 : 0,
          transition:
            "width 0.25s ease, opacity 0.25s ease, padding 0.25s ease",
          overflow: "hidden",
          border: "2px solid var(--button-border)",
          background: "var(--button-bg)",
          color: "var(--primary-text)",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "1rem",
          boxShadow: "0 2px 8px rgba(35,35,35,0.04)",
        }}
      />
      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-2 p-3 rounded-lg glass-panel"
          style={{ top: "100%" }}
        >
          {renderResults ? (
            renderResults(value, isMobile, () => setOpen(false))
          ) : (
            <div className="text-sm opacity-70">
              {isMobile ? "Mobile" : "Desktop"} search open
            </div>
          )}
        </div>
      )}
    </div>
  );
}
