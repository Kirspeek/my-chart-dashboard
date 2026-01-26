"use client";

import { Search } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import SearchResults from "./common/SearchResults";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import SunMoonToggle from "./common/SunMoonToggle";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { colorsTheme } = useTheme();
  const headerColors = colorsTheme.widgets.header;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Detect mobile/tablet/desktop
  useEffect(() => {
    const checkMobile = () => {
      const isPhone = window.innerWidth <= 425;
      setIsMobile(isPhone);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchOpen(value.length > 0);
  };

  const handleResultClick = (slideIndex: number) => {
    // For now, we'll just log the slide index
    // In a real implementation, you'd navigate to that slide
    console.log(`Navigate to slide ${slideIndex}`);
    setIsSearchOpen(false);
  };

  return (
    <header
      className="glass-panel shadow-sm relative z-30"
      style={{ borderBottom: "2px solid rgba(0,0,0,0.06)" }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1
              className="text-xl primary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 900,
                letterSpacing: "0.01em",
              }}
            >
              Chart Dashboard
            </h1>
          </div>

          <div className="flex items-center h-16 gap-4">
            <div className="-ml-2">
              <SunMoonToggle />
            </div>
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <Search
                  style={{ color: headerColors.icon, width: 24, height: 24 }}
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchOpen(searchTerm.length > 0)}
                placeholder="Search widgets..."
                className="search-mono-input search-input-enhanced w-full"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--primary-text)",
                  background: "var(--button-bg)",
                  border: "2px solid var(--button-border)",
                  borderRadius: "1rem",
                  padding: "0.6rem 1.2rem 0.6rem 2.5rem",
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(35,35,35,0.04)",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              />
              <SearchResults
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onResultClick={handleResultClick}
                isMobile={isMobile}
              />
            </div>

            {/* Contact Link */}
            <a
              href="https://kirspeek.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold secondary-text hover:text-blue-400 transition-colors"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.01em",
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
