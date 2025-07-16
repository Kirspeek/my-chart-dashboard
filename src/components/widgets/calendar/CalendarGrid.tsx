"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import type { CalendarEvent } from "../../../../interfaces/widgets";
import { useTheme } from "../../../hooks/useTheme";

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
  const { accent } = useTheme();
  const accentColor = accent.teal;
  const todayBackgroundColor = "rgba(35, 35, 35, 0.15)"; // Darker gray background for today

  const hasEvents = (date: Date) => {
    return events.some(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  if (viewMode === "day") {
    // Day view - show single day with more details
    const day = days[0];
    if (!day) return null;

    const dayEvents = events.filter(
      (event) => event.date.toDateString() === day.toDateString()
    );

    return (
      <div className="w-full text-center">
        <div className="text-6xl font-bold text-gray-800 mb-4">
          {day.getDate()}
        </div>
        <div className="text-lg font-medium text-gray-600 mb-2">
          {day.toLocaleDateString("en-US", { weekday: "long" })}
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {day.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
        {dayEvents.length > 0 && (
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Today&apos;s Events:
            </div>
            {dayEvents.map((event) => (
              <div key={event.id} className="p-2 bg-gray-50 rounded-lg mb-2">
                <div className="font-medium text-gray-800">{event.title}</div>
                {event.description && (
                  <div className="text-sm text-gray-600">
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
    // Week view - show 7 days horizontally
    return (
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

        {/* Week grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);
            const hasEventsForDate = hasEvents(date);

            return (
              <Button3D
                key={index}
                selected={isSelectedDate}
                onClick={() => onDateSelect(date)}
                customBackground={
                  isTodayDate ? todayBackgroundColor : undefined
                }
                style={{
                  padding: "0.5rem",
                  minWidth: "auto",
                  minHeight: "auto",
                  aspectRatio: "1",
                  fontSize: "0.875rem",
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-medium">{date.getDate()}</span>
                  {hasEventsForDate && (
                    <div
                      className="w-1 h-1 rounded-full mt-0.5"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                  {isTodayDate && !hasEventsForDate && (
                    <div
                      className="w-1 h-1 rounded-full mt-0.5"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </div>
              </Button3D>
            );
          })}
        </div>
      </div>
    );
  }

  // Month view (default)
  return (
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

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const isCurrentMonthDate = isCurrentMonth(date);
          const hasEventsForDate = hasEvents(date);

          return (
            <Button3D
              key={index}
              selected={isSelectedDate}
              onClick={() => onDateSelect(date)}
              customBackground={isTodayDate ? todayBackgroundColor : undefined}
              style={{
                padding: "0.25rem",
                minWidth: "auto",
                minHeight: "auto",
                aspectRatio: "1",
                fontSize: "0.75rem",
                opacity: isCurrentMonthDate ? 1 : 0.4,
              }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="font-medium">{date.getDate()}</span>
                {hasEventsForDate && (
                  <div
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
                {isTodayDate && !hasEventsForDate && (
                  <div
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </div>
            </Button3D>
          );
        })}
      </div>
    </div>
  );
}
