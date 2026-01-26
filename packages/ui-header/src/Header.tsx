import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Title from "./parts/Title";
import NavButtons from "./parts/NavButtons";
import SearchBox from "./parts/SearchBox";
import ContactIcons from "./parts/ContactIcons";

import type { HeaderProps, HeaderLink, SectionKey } from "./types";

export default function Header({
  title = "Chart Dashboard",
  onSearch,
  searchPlaceholder = "Search...",
  contactEmail,
  contactLinks = [],
  renderSearchResults,
  pill = false,
  className,
  defaultSection = "dashboard",
  sections,
  onSectionChange,
  onMenuClick,
}: HeaderProps) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeSection, setActiveSection] =
    useState<SectionKey>(defaultSection);
  const searchRef = useRef<HTMLDivElement>(null);

  const iconSize = isMobile ? 22 : isTablet ? 26 : 28;
  const orangeColor = "#ff6b4a";
  const iconStroke = isMobile ? 2.2 : isTablet ? 2.35 : 2.5;

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 425);
      setIsTablet(width > 425 && width <= 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    setIsOpen(next.length > 0);
    onSearch?.(next);
  };

  const containerStyle: React.CSSProperties | undefined = pill
    ? {
      borderRadius: 9999,
      border: "2px solid #222",
      background: "#ded4c6",
      boxShadow: "0 2px 0 #222, inset 0 0 0 2px rgba(255,255,255,0.35)",
      padding: 6,
    }
    : undefined;

  const defaultSections: Array<{ key: SectionKey; label: string }> = [
    { key: "dashboard", label: "Chart Dashboard" },
  ];
  const sectionList = sections && sections.length ? sections : defaultSections;
  const sectionLabelMap = new Map(sectionList.map((s) => [s.key, s.label]));
  const computedTitle = sectionLabelMap.get(activeSection) || title;

  const setSection = (next: SectionKey) => {
    setActiveSection(next);
    onSectionChange?.(next);
    if (next !== "dashboard") {
      setIsSearchVisible(false);
      setIsOpen(false);
      setValue("");
    }
  };

  const aboutLink = contactLinks?.find((l) =>
    /about|link|website|portfolio/i.test(l.label)
  );

  return (
    <header
      className={`relative z-30 ${className ?? ""}`}
      style={containerStyle}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <div className="flex items-center gap-3 py-1 w-full relative">
            {/* Left: Hamburger */}
            <button
              type="button"
              className="p-2 -ml-2 rounded-md focus:outline-none flex-shrink-0"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <div className="space-y-1.5">
                <span
                  className="block w-6 h-0.5"
                  style={{ background: orangeColor }}
                ></span>
                <span
                  className="block w-6 h-0.5"
                  style={{ background: orangeColor }}
                ></span>
                <span
                  className="block w-6 h-0.5"
                  style={{ background: orangeColor }}
                ></span>
              </div>
            </button>

            {/* Center: Title (Expanded to push right icons) */}
            <div className="flex-1 flex justify-center">
              <Title text={computedTitle} fontSize="1.1rem" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {activeSection === "dashboard" && (
                <div style={{ transform: "translateY(2px)" }}>
                  <SearchBox
                    value={value}
                    onChange={onChange}
                    placeholder={searchPlaceholder}
                    isVisible={isSearchVisible}
                    setVisible={setIsSearchVisible}
                    isOpen={isOpen}
                    setOpen={setIsOpen}
                    renderResults={renderSearchResults}
                    isMobile={isMobile}
                    color={orangeColor}
                    stroke={iconStroke}
                    searchRef={searchRef}
                  />
                </div>
              )}
              <ContactIcons
                contactEmail={contactEmail}
                contactLinks={contactLinks}
                aboutLink={aboutLink as HeaderLink | undefined}
                showAboutLink={false}
                color={orangeColor}
                size={iconSize}
                stroke={iconStroke}
                gapClass="gap-3"
              />
            </div>
          </div>
        ) : isTablet ? (
          <div className="flex items-center h-16 gap-4">
            <button
              type="button"
              className="p-2 -ml-2 rounded-md focus:outline-none"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <div className="space-y-1.5">
                <span
                  className="block w-7 h-0.5"
                  style={{ background: orangeColor }}
                ></span>
                <span
                  className="block w-7 h-0.5"
                  style={{ background: orangeColor }}
                ></span>
                <span
                  className="block w-7 h-0.5"
                  style={{ background: orangeColor }}
                ></span>
              </div>
            </button>
            <Title text={computedTitle} fontSize="1.55rem" />

            <div className="flex items-center gap-4 ml-4">
              {activeSection === "dashboard" && (
                <SearchBox
                  value={value}
                  onChange={onChange}
                  placeholder={searchPlaceholder}
                  isVisible={isSearchVisible}
                  setVisible={setIsSearchVisible}
                  isOpen={isOpen}
                  setOpen={setIsOpen}
                  renderResults={renderSearchResults}
                  isMobile={isMobile}
                  color={orangeColor}
                  stroke={iconStroke}
                  searchRef={searchRef}
                />
              )}
              {(contactEmail || (contactLinks && contactLinks.length > 0)) && (
                <ContactIcons
                  contactEmail={contactEmail}
                  contactLinks={contactLinks}
                  aboutLink={aboutLink as HeaderLink | undefined}
                  showAboutLink={false}
                  color={orangeColor}
                  size={iconSize}
                  stroke={iconStroke}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="relative flex items-center h-16">
            <div className="flex items-center gap-4">
              {/* Desktop Hamburger */}
              <button
                type="button"
                className="p-2 -ml-2 rounded-md focus:outline-none hover:bg-white/5 transition-colors"
                onClick={onMenuClick}
                aria-label="Open menu"
              >
                <div className="space-y-1.5">
                  <span
                    className="block w-6 h-[3px] rounded-full"
                    style={{ background: orangeColor }}
                  ></span>
                  <span
                    className="block w-6 h-[3px] rounded-full"
                    style={{ background: orangeColor }}
                  ></span>
                  <span
                    className="block w-6 h-[3px] rounded-full"
                    style={{ background: orangeColor }}
                  ></span>
                </div>
              </button>
              <h1
                className="primary-text"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 900,
                  letterSpacing: "0.01em",
                  fontSize: "1.85rem",
                }}
              >
                {computedTitle}
              </h1>
            </div>

            {/* Centered navigation buttons */}
            <div className="absolute left-1/2 -translate-x-1/2 transform w-full flex justify-center pointer-events-none">
              <div className="hidden md:flex items-center gap-2 pointer-events-auto">
                {sectionList
                  .map((s) => s.key)
                  .filter((k) => k !== activeSection)
                  .map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSection(key)}
                      className="widget-button px-3 py-1.5 rounded-full text-sm"
                      style={{
                        fontWeight: 700,
                        letterSpacing: "0.01em",
                        border: `1.5px solid ${orangeColor}`,
                        color: orangeColor,
                        background: "transparent",
                      }}
                    >
                      {sectionLabelMap.get(key) ?? key}
                    </button>
                  ))}
              </div>
            </div>

            <div className="ml-auto flex items-center space-x-4">
              {/* Search icon that reveals input on hover/focus (Dashboard only) */}
              {activeSection === "dashboard" && (
                <div
                  className="relative flex items-center"
                  ref={searchRef}
                  onMouseEnter={() => setIsSearchVisible(true)}
                  onMouseLeave={() => {
                    if (!value) setIsSearchVisible(false);
                  }}
                >
                  <a
                    role="button"
                    aria-label="Open search"
                    onClick={() => setIsSearchVisible(true)}
                    title="Search"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Search
                      size={iconSize}
                      color={orangeColor}
                      strokeWidth={iconStroke}
                    />
                  </a>
                  <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onFocus={() => {
                      setIsSearchVisible(true);
                      setIsOpen(value.length > 0);
                    }}
                    onBlur={() => {
                      if (!value) setIsSearchVisible(false);
                    }}
                    placeholder={searchPlaceholder}
                    className="search-mono-input search-input-enhanced"
                    style={{
                      borderRadius: "1rem",
                      padding: isSearchVisible ? "0.5rem 0.9rem" : "0 0",
                      width: isSearchVisible ? 220 : 0,
                      opacity: isSearchVisible ? 1 : 0,
                      marginLeft: isSearchVisible ? 16 : 0,
                      transition:
                        "width 0.25s ease, opacity 0.25s ease, padding 0.25s ease",
                      overflow: "hidden",
                    }}
                  />
                  {isOpen && (
                    <div
                      className="absolute left-0 right-0 mt-2 p-3 rounded-lg glass-panel"
                      style={{ top: "100%" }}
                    >
                      {renderSearchResults ? (
                        renderSearchResults(value, isMobile, () =>
                          setIsOpen(false)
                        )
                      ) : (
                        <div className="text-sm opacity-70">
                          {isMobile ? "Mobile" : "Desktop"} search open
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {contactEmail || (contactLinks && contactLinks.length > 0) ? (
                <ContactIcons
                  contactEmail={contactEmail}
                  contactLinks={contactLinks}
                  aboutLink={aboutLink as HeaderLink | undefined}
                  showAboutLink={false}
                  color={orangeColor}
                  size={iconSize}
                  stroke={iconStroke}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
