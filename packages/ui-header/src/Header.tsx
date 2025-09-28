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
    { key: "projects", label: "Projects" },
    { key: "about", label: "About me" },
    { key: "experience", label: "Work experience" },
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
          <div className="flex flex-col gap-3 py-3">
            <div className="flex items-center justify-center">
              <Title text={computedTitle} fontSize="1.2rem" />
            </div>
            <NavButtons
              sections={["dashboard", "projects", "about", "experience"]}
              activeSection={activeSection}
              onSelect={setSection}
              labelMap={
                sectionLabelMap as Map<
                  "dashboard" | "projects" | "about" | "experience",
                  string
                >
              }
              getSectionHref={undefined}
              color={orangeColor}
              borderWidth={1.5}
              textSizeClass="text-xs"
              paddingClass="px-2.5 py-1.5"
              className="flex flex-wrap items-center justify-center gap-1.5"
            />
            {(contactEmail ||
              (contactLinks && contactLinks.length > 0) ||
              activeSection === "dashboard") && (
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
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
                  <ContactIcons
                    contactEmail={contactEmail}
                    contactLinks={contactLinks}
                    aboutLink={aboutLink as HeaderLink | undefined}
                    showAboutLink={activeSection === "about"}
                    color={orangeColor}
                    size={iconSize}
                    stroke={iconStroke}
                    gapClass="gap-3"
                  />
                </div>
              </div>
            )}
          </div>
        ) : isTablet ? (
          <div className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-center">
              <Title text={computedTitle} fontSize="1.55rem" />
            </div>
            <NavButtons
              sections={["dashboard", "projects", "about", "experience"]}
              activeSection={activeSection}
              onSelect={setSection}
              labelMap={
                sectionLabelMap as Map<
                  "dashboard" | "projects" | "about" | "experience",
                  string
                >
              }
              getSectionHref={undefined}
              color={orangeColor}
              borderWidth={1.5}
              textSizeClass="text-sm"
              paddingClass="px-3 py-1.5"
              className="flex flex-wrap items-center justify-center gap-2"
            />
            {(contactEmail ||
              (contactLinks && contactLinks.length > 0) ||
              activeSection === "dashboard") && (
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-4">
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
                  <ContactIcons
                    contactEmail={contactEmail}
                    contactLinks={contactLinks}
                    aboutLink={aboutLink as HeaderLink | undefined}
                    showAboutLink={activeSection === "about"}
                    color={orangeColor}
                    size={iconSize}
                    stroke={iconStroke}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex items-center h-16">
            <div className="flex items-center">
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
                {(["dashboard", "projects", "about", "experience"] as const)
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
                  showAboutLink={activeSection === "about"}
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
