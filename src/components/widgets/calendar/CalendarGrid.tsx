"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import type { CalendarEvent } from "../../../../interfaces/widgets";
import { useTheme } from "@/hooks/useTheme";

interface CalendarGridProps {
  days: Date[];
  weekDays: string[];
  events: CalendarEvent[];
  viewMode: "month" | "week" | "day";
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onDateSelect: (date: Date) => void;
}

export default function CalendarGrid({
  days,
  weekDays,
  events,
  viewMode,
  isToday,
  isSelected,
  isCurrentMonth,
  onDateSelect,
}: CalendarGridProps) {
  const { colorsTheme } = useTheme();
  const calendarColors = colorsTheme.widgets.calendar;

  const safeWeekDays =
    Array.isArray(weekDays) && weekDays.length > 0
      ? weekDays
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const safeDays = Array.isArray(days) ? days : [];

  const hasEvents = (date: Date) => {
    return events.some(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  if (viewMode === "day") {
    // Day view - show single day with more details
    const day = safeDays[0];
    if (!day) return null;

    const dayEvents = events.filter(
      (event) => event.date.toDateString() === day.toDateString()
    );

    return (
      <div className="w-full text-center">
        <div className="text-6xl font-bold primary-text mb-4">
          {day.getDate()}
        </div>
        <div className="text-lg font-medium secondary-text mb-2">
          {day.toLocaleDateString("en-US", { weekday: "long" })}
        </div>
        <div className="text-sm muted-text mb-4">
          {day.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
        {dayEvents.length > 0 && (
          <div className="text-left">
            <div className="text-sm font-semibold primary-text mb-2">
              Today&apos;s Events:
            </div>
            {dayEvents.map((event) => (
              <div key={event.id} className="p-2 widget-button rounded-lg mb-2">
                <div className="font-medium primary-text">{event.title}</div>
                {event.description && (
                  <div className="text-sm secondary-text">
                    {event.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "week") {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1 flex-shrink-0">
          {safeWeekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-[10px] font-medium secondary-text py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {safeDays.slice(0, 7).map((day, index) => (
            <Button3D
              key={index}
              selected={isSelected(day)}
              onClick={() => onDateSelect(day)}
              customAccentColor={calendarColors.accentColor}
              style={{
                padding: "0.5rem",
                minWidth: "auto",
                minHeight: "auto",
                fontSize: "0.875rem",
                position: "relative",
              }}
            >
              <div className="text-center">
                <div
                  className={`font-bold ${
                    isToday(day)
                      ? "calendar-today"
                      : isCurrentMonth(day)
                        ? "calendar-day"
                        : "calendar-day-muted"
                  }`}
                >
                  {day.getDate()}
                </div>
                {hasEvents(day) && (
                  <div
                    className="w-2 h-2 rounded-full mx-auto mt-1"
                    style={{ backgroundColor: calendarColors.accentColor }}
                  />
                )}
              </div>
            </Button3D>
          ))}
        </div>
      </div>
    );
  }

  // Month view (default)
  return (
    <div className="w-full h-full flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 flex-shrink-0">
        {safeWeekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-[10px] font-medium secondary-text py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {safeDays.map((day, index) => (
          <Button3D
            key={index}
            selected={isSelected(day)}
            onClick={() => onDateSelect(day)}
            customAccentColor={calendarColors.accentColor}
            style={{
              padding: "0.25rem",
              minWidth: "auto",
              minHeight: "auto",
              fontSize: "0.75rem",
              position: "relative",
            }}
          >
            <div className="text-center">
              <div
                className={`font-bold ${
                  isToday(day)
                    ? "calendar-today"
                    : isCurrentMonth(day)
                      ? "calendar-day"
                      : "calendar-day-muted"
                }`}
              >
                {day.getDate()}
              </div>
              {hasEvents(day) && (
                <div
                  className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5"
                  style={{ backgroundColor: calendarColors.accentColor }}
                />
              )}
            </div>
          </Button3D>
        ))}
      </div>
    </div>
  );
}
