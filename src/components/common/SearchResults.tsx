"use client";

import React from "react";
import { useSearch } from "../../context/SearchContext";
import { Search, X, Grid3X3 } from "lucide-react";

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (slideIndex: number) => void;
  isMobile: boolean;
}

export default function SearchResults({
  isOpen,
  onClose,
  onResultClick,
  isMobile,
}: SearchResultsProps) {
  const { searchTerm, searchResults, clearSearch, setShowFilteredWidgets } =
    useSearch();

  if (!isOpen || !searchTerm.trim()) {
    return null;
  }

  const handleShowResults = () => {
    setShowFilteredWidgets(true);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black bg-opacity-20"
        onClick={onClose}
      />

      {/* Search Results */}
      <div className="fixed top-20 left-4 right-4 search-results-container rounded-lg z-[10000] max-h-80 overflow-y-auto search-results-scroll shadow-2xl border-2 border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for &quot;{searchTerm}
                &quot;
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearSearch}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Close search"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
            </div>
          </div>
        </div>

        <div className="py-2">
          {searchResults.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for &quot;{searchTerm}&quot;</p>
              <p className="text-sm mt-1">
                Try searching for: clock, weather, timer, map, calendar, wallet,
                sales, performance, etc.
              </p>
            </div>
          ) : (
            <>
              {/* Show Results Button for Desktop/Tablet */}
              {!isMobile && (
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600">
                  <button
                    onClick={handleShowResults}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>
                      Show {searchResults.length} Widget
                      {searchResults.length !== 1 ? "s" : ""} in Grid
                    </span>
                  </button>
                </div>
              )}

              {/* Search Results List */}
              <div className="text-xs text-gray-500 dark:text-gray-400 px-4 py-2 border-b border-gray-100 dark:border-gray-600">
                {isMobile ? "Tap to navigate:" : "Click to navigate:"}
              </div>

              {searchResults.map((result, index) => (
                <button
                  key={`${result.widgetType}-${index}`}
                  onClick={() => {
                    onResultClick(result.slideIndex || 0);
                    onClose();
                  }}
                  className="w-full px-4 py-3 text-left search-result-item border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="search-result-slide-number">
                      <span className="text-xs font-bold">
                        {result.slideIndex !== undefined
                          ? result.slideIndex + 1
                          : "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {result.widgetType
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
