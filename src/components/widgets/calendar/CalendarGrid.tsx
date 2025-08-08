"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import type { CalendarEvent } from "../../../../interfaces/widgets";
import { useTheme } from "src/hooks/useTheme";

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
  const todayBackgroundColor = "rgba(35, 35, 35, 0.15)";

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
    return (
      <div className="w-full h-full flex flex-col">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1 flex-shrink-0">
          {safeWeekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-[10px] font-medium text-gray-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div
          className="grid grid-cols-7 gap-1 flex-1"
          style={{ gridTemplateRows: "repeat(1, 1fr)" }}
        >
          {safeDays.map((date, index) => {
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
                  width: "100%",
                  height: "100%",
                  padding: "0.35rem",
                  minWidth: 0,
                  minHeight: 0,
                  aspectRatio: "1 / 1",
                  fontSize: "0.875rem",
                  borderRadius: "9999px",
                }}
                className="mx-auto my-auto max-w-[56px] max-h-[56px] min-[425px]:max-w-none min-[425px]:max-h-none min-[425px]:p-0.5 min-[425px]:text-[10px] lg:p-2 lg:text-sm"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-medium">{date.getDate()}</span>
                  {hasEventsForDate && (
                    <div
                      className="w-1 h-1 rounded-full mt-0.5 min-[425px]:w-0.5 min-[425px]:h-0.5 lg:w-1 lg:h-1"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                  {isTodayDate && !hasEventsForDate && (
                    <div
                      className="w-1 h-1 rounded-full mt-0.5 min-[425px]:w-0.5 min-[425px]:h-0.5 lg:w-1 lg:h-1"
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
    <div className="w-full h-full flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 flex-shrink-0">
        {safeWeekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-[10px] font-medium text-gray-600 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - 5 equal rows */}
      <div
        className="grid grid-cols-7 gap-1 flex-1"
        style={{ gridTemplateRows: "repeat(5, 1fr)" }}
      >
        {safeDays.map((date, index) => {
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
                width: "100%",
                height: "100%",
                padding: "0.25rem",
                minWidth: 0,
                minHeight: 0,
                aspectRatio: "1 / 1",
                fontSize: "0.75rem",
                borderRadius: "9999px",
                opacity: isCurrentMonthDate ? 1 : 0.4,
              }}
              className="mx-auto my-auto max-w-[52px] max-h-[52px] min-[425px]:max-w-none min-[425px]:max-h-none min-[425px]:p-0.5 min-[425px]:text-[10px] lg:p-2 lg:text-sm"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="font-medium">{date.getDate()}</span>
                {hasEventsForDate && (
                  <div
                    className="w-1 h-1 rounded-full mt-0.5 min-[425px]:w-0.5 min-[425px]:h-0.5 lg:w-1 lg:h-1"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
                {isTodayDate && !hasEventsForDate && (
                  <div
                    className="w-1 h-1 rounded-full mt-0.5 min-[425px]:w-0.5 min-[425px]:h-0.5 lg:w-1 lg:h-1"
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
