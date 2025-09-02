"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import type { SearchContextType, SearchResult } from "@/interfaces/context";

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showFilteredWidgets, setShowFilteredWidgets] = useState(false);

  // Define all widgets with their titles, subtitles, and content
  const allWidgets: SearchResult[] = useMemo(
    () => [
      // Clock Widget
      {
        type: "widget",
        title: "Clock",
        widgetType: "clock",
        slideIndex: 0,
      },
      // Weather Widget
      {
        type: "widget",
        title: "Weather",
        subtitle: "Current weather conditions",
        widgetType: "weather",
        slideIndex: 0,
      },
      // Timer Widget
      {
        type: "widget",
        title: "Timer",
        subtitle: "Countdown timer",
        widgetType: "timer",
        slideIndex: 1,
      },
      // Map Widget
      {
        type: "widget",
        title: "Map",
        subtitle: "Interactive world map",
        widgetType: "map",
        slideIndex: 2,
      },
      // Calendar Widget
      {
        type: "widget",
        title: "Calendar",
        subtitle: "Event calendar",
        widgetType: "calendar",
        slideIndex: 3,
      },
      // Wallet Widget
      {
        type: "widget",
        title: "Wallet",
        subtitle: "Financial cards management",
        widgetType: "wallet",
        slideIndex: 4,
      },
      // Wallet Card Widget
      {
        type: "widget",
        title: "Wallet Card",
        subtitle: "Individual card details",
        widgetType: "wallet-card",
        slideIndex: 5,
      },
      // Aggregated Spending Widget
      {
        type: "widget",
        title: "Aggregated Spending",
        subtitle: "Total spending overview",
        widgetType: "aggregated-spending",
        slideIndex: 6,
      },
      // Financial Activity Overview
      {
        type: "widget",
        title: "Financial Activity Overview",
        subtitle: "Daily activity levels",
        widgetType: "contribution-graph",
        slideIndex: 7,
      },
      // Metric Cards
      {
        type: "widget",
        title: "Total Sales",
        subtitle: "Sales metrics",
        widgetType: "metric",
        slideIndex: 8,
      },
      {
        type: "widget",
        title: "Total Revenue",
        subtitle: "Revenue metrics",
        widgetType: "metric",
        slideIndex: 8,
      },
      {
        type: "widget",
        title: "Active Users",
        subtitle: "User metrics",
        widgetType: "metric",
        slideIndex: 8,
      },
      {
        type: "widget",
        title: "Conversion Rate",
        subtitle: "Conversion metrics",
        widgetType: "metric",
        slideIndex: 8,
      },
      // Sales Performance
      {
        type: "widget",
        title: "Sales Performance",
        subtitle: "Sales trends and analytics",
        widgetType: "line-chart",
        slideIndex: 9,
      },
      // Quarterly Overview
      {
        type: "widget",
        title: "Quarterly Overview",
        subtitle: "Quarterly performance data",
        widgetType: "bar-chart",
        slideIndex: 10,
      },
      // Performance Metrics
      {
        type: "widget",
        title: "Performance Metrics",
        subtitle: "Performance analytics",
        widgetType: "radar-chart",
        slideIndex: 11,
      },
      // Device Usage
      {
        type: "widget",
        title: "Device Usage",
        subtitle: "Device analytics",
        widgetType: "device-usage",
        slideIndex: 12,
      },
      // Global Migration Flows
      {
        type: "widget",
        title: "Global Migration Flows",
        subtitle: "2019/2020",
        widgetType: "sankey-chart",
        slideIndex: 13,
      },
      // Global Migrations
      {
        type: "widget",
        title: "Global Migrations",
        subtitle: "2023",
        widgetType: "chord-chart",
        slideIndex: 14,
      },
      // Global Tech Investment
      {
        type: "widget",
        title: "Global Tech Investment",
        subtitle: "Market Cap vs Growth vs Workforce Size",
        widgetType: "bubble-chart",
        slideIndex: 15,
      },
      // Timeline of Renewable Energy Milestones
      {
        type: "widget",
        title: "Timeline of Renewable Energy Milestones",
        subtitle: "Historical energy milestones",
        widgetType: "timeline-rings",
        slideIndex: 16,
      },
      // Recent Users
      {
        type: "widget",
        title: "Recent Users",
        subtitle: "User activity",
        widgetType: "recent-users",
        slideIndex: 16,
      },
    ],
    []
  );

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    return allWidgets.filter((widget) => {
      const titleMatch = widget.title.toLowerCase().includes(term);
      const subtitleMatch = widget.subtitle?.toLowerCase().includes(term);
      const contentMatch = widget.content?.toLowerCase().includes(term);

      return titleMatch || subtitleMatch || contentMatch;
    });
  }, [searchTerm, allWidgets]);

  // Get unique widget types from search results
  const filteredWidgetTypes = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const uniqueTypes = [
      ...new Set(searchResults.map((result) => result.widgetType)),
    ];
    return uniqueTypes;
  }, [searchResults, searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setShowFilteredWidgets(false);
  };

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    clearSearch,
    showFilteredWidgets,
    setShowFilteredWidgets,
    filteredWidgetTypes,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
