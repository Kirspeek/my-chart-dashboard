"use client";

import React, { useState } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { CalendarWidgetProps } from "../../../../interfaces/widgets";
import { useCalendarLogic } from "src/hooks/useCalendarLogic";
import CalendarHeader from "./CalendarHeader";
import Button3D from "../../common/3DButton";
import { useTheme } from "src/hooks/useTheme";

export default function CalendarWidgetMobile({
  onDateSelect,
  initialDate,
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: CalendarWidgetProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const {
    currentDate,
    selectedDate,
    viewMode,
    events,
    showEventForm,
    setSelectedDate,
    setViewMode,
    goToPrevious,
    goToNext,
    goToToday,
    getDaysInMonth,
    getWeekDays,
    isToday,
    isSelected,
    isCurrentMonth,
    addEvent,
    toggleEventForm,
  } = useCalendarLogic(onDateSelect, initialDate);

  const [newEventTitle, setNewEventTitle] = useState("");

  // Set today as default selected date if no date is selected
  React.useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays();
  const { accent } = useTheme();
  const accentColor = accent.teal;
  const todayBackgroundColor = "rgba(35, 35, 35, 0.15)";

  const hasEvents = (date: Date) => {
    return events.some(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;

    addEvent({
      title: newEventTitle.trim(),
      date: selectedDate,
    });

    setNewEventTitle("");
    toggleEventForm(); // Hide the form after adding event
  };

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      day: date.getDate(),
      dayName: days[date.getDay()],
      month: months[date.getMonth()],
      year: date.getFullYear(),
    };
  };

  const selectedDateInfo = selectedDate ? formatDate(selectedDate) : null;
  const dayEvents = selectedDate
    ? events.filter(
        (event) => event.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  return (
    <WidgetBase
      className="calendar-widget-mobile"
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
      style={{ position: "relative" }}
    >
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewModeChange={setViewMode}
      />

      <div className="flex flex-col flex-1 gap-6 min-h-0">
        {/* Calendar Grid - Smaller circles */}
        <div className="flex-1 calendar-grid">
          <div className="w-full">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid - Smaller circles */}
            <div className="grid grid-cols-7 gap-1 calendar-date-circles">
              {days.map((date, index) => {
                const isTodayDate = isToday(date);
                const isSelectedDate = isSelected(date);
                const isCurrentMonthDate = isCurrentMonth(date);
                const hasEventsForDate = hasEvents(date);

                return (
                  <Button3D
                    key={index}
                    selected={isSelectedDate}
                    onClick={() => setSelectedDate(date)}
                    customBackground={
                      isTodayDate ? todayBackgroundColor : undefined
                    }
                    className="calendar-date-circle"
                    style={{
                      padding: "0",
                      minWidth: "auto",
                      minHeight: "auto",
                      aspectRatio: "1",
                      fontSize: "0.6rem",
                      opacity: isCurrentMonthDate ? 1 : 0.4,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="font-medium">{date.getDate()}</span>
                      {hasEventsForDate && (
                        <div
                          className="w-0.5 h-0.5 rounded-full mt-0.5"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                      {isTodayDate && !hasEventsForDate && (
                        <div
                          className="w-0.5 h-0.5 rounded-full mt-0.5"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                    </div>
                  </Button3D>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date and Events Section - Row layout */}
        <div className="flex-shrink-0 calendar-events-section pb-1">
          {selectedDateInfo && (
            <div className="p-2">
              {/* Selected Date Display and Events in Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-800">
                    {selectedDateInfo.day}
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {selectedDateInfo.dayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedDateInfo.month} {selectedDateInfo.year}
                  </div>
                </div>

                {/* Events List - Inline with date */}
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-700">
                    Events ({dayEvents.length})
                  </div>
                  {dayEvents.length === 0 ? (
                    <div className="text-xs text-gray-500 italic">
                      No events
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="truncate">
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Event Form - Fixed at bottom */}
              <div className="flex flex-col gap-2">
                {showEventForm && (
                  <div className="space-y-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add event"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <div className="flex gap-1">
                      <Button3D
                        onClick={handleAddEvent}
                        style={{
                          padding: "0.125rem 0.25rem",
                          minWidth: "auto",
                          minHeight: "auto",
                          fontSize: "0.625rem",
                        }}
                      >
                        Add
                      </Button3D>
                      <Button3D
                        onClick={() => {
                          setNewEventTitle("");
                          toggleEventForm();
                        }}
                        style={{
                          padding: "0.125rem 0.25rem",
                          minWidth: "auto",
                          minHeight: "auto",
                          fontSize: "0.625rem",
                        }}
                      >
                        Cancel
                      </Button3D>
                    </div>
                  </div>
                )}

                {/* Add Event Button - Always at bottom */}
                <Button3D
                  onClick={toggleEventForm}
                  style={{
                    padding: "0.375rem",
                    minWidth: "auto",
                    minHeight: "auto",
                    fontSize: "0.625rem",
                  }}
                >
                  + Add Event
                </Button3D>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
