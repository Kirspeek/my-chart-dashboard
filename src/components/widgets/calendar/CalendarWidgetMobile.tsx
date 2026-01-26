"use client";

import React, { useState } from "react";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { CalendarWidgetProps } from "@/interfaces/widgets";
import { useCalendarLogic } from "@/hooks/useCalendarLogic";
import CalendarHeader from "./CalendarHeader";
import Button3D from "../../common/3DButton";
import { useTheme } from "@/hooks/useTheme";

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

  React.useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays();
  const { colorsTheme } = useTheme();
  const calendarColors = colorsTheme.widgets.calendar;

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
    toggleEventForm();
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
        <div className="flex-1 calendar-grid">
          <div className="w-full">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium py-1"
                  style={{ color: calendarColors.textColors.secondary }}
                >
                  {day}
                </div>
              ))}
            </div>

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
                      isTodayDate ? calendarColors.todayBackground : undefined
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
                          style={{
                            backgroundColor: calendarColors.accentColor,
                          }}
                        />
                      )}
                      {isTodayDate && !hasEventsForDate && (
                        <div
                          className="w-0.5 h-0.5 rounded-full mt-0.5"
                          style={{
                            backgroundColor: calendarColors.accentColor,
                          }}
                        />
                      )}
                    </div>
                  </Button3D>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 calendar-events-section pb-1 hidden">
          {selectedDateInfo && (
            null
          )}
        </div>
      </div>
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
