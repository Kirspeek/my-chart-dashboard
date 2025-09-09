"use client";

import React from "react";
import Button3D from "../../common/3DButton";
import type { CalendarEvent } from "@/interfaces/widgets";
import { useTheme } from "@/hooks/useTheme";

interface CalendarGridProps {
  currentDate?: Date;
  days: Date[];
  weekDays: string[];
  events: CalendarEvent[];
  viewMode: "month" | "week" | "day" | "year";
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onDateSelect: (date: Date) => void;
}

export default function CalendarGrid({
  currentDate,
  days,
  weekDays,
  events,
  viewMode,
  isToday,
  isSelected,
  onDateSelect,
}: CalendarGridProps) {
  const { colorsTheme } = useTheme();
  const calendarColors = colorsTheme.widgets.calendar;
  const selectedYearRef = React.useRef<HTMLDivElement | null>(null);
  const yearsContainerRef = React.useRef<HTMLDivElement | null>(null);
  const safeCurrentDate =
    currentDate ?? (Array.isArray(days) ? days[0] : undefined) ?? new Date();
  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = todayDate.getMonth();
  const baseYearForScroll = safeCurrentDate.getFullYear();
  React.useEffect(() => {
    const container = yearsContainerRef.current;
    const selected = selectedYearRef.current;
    if (container && selected) {
      const top = selected.offsetTop - container.offsetTop;
      container.scrollTop = top;
    }
  }, [baseYearForScroll]);

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
    const day = safeDays[0];
    if (!day) return null;

    const dayEvents = events.filter(
      (event) => event.date.toDateString() === day.toDateString()
    );

    return (
      <div className="w-full flex justify-center">
        <div
          className="text-center rounded-2xl px-6 py-4"
          style={{
            maxWidth: 520,
            width: "100%",
            border: `2px solid ${calendarColors.accentColor}`,
            background: calendarColors.todayBackground,
            boxShadow:
              "0 8px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="text-6xl font-bold primary-text mb-2">
            {day.getDate()}
          </div>
          <div
            className="text-lg font-semibold mb-1"
            style={{ color: calendarColors.textColors.primary }}
          >
            {day.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <div
            className="text-sm mb-4"
            style={{ color: calendarColors.textColors.secondary }}
          >
            {day.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          {dayEvents.length > 0 && (
            <div className="text-left">
              <div className="text-sm font-semibold primary-text mb-2">
                Today&apos;s Events:
              </div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 widget-button rounded-lg mb-2"
                >
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
      </div>
    );
  }

  if (viewMode === "week") {
    const base = safeDays[0] ?? safeCurrentDate;
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    const monthDays: Date[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      monthDays.push(new Date(year, month, -i));
    }
    for (let d = 1; d <= daysInMonth; d++) {
      monthDays.push(new Date(year, month, d));
    }
    const remaining = 35 - monthDays.length;
    for (let d = 1; d <= remaining; d++) {
      monthDays.push(new Date(year, month + 1, d));
    }
    const monthDaysTrimmed = monthDays.slice(0, 35);

    return (
      <div className="w-full h-full flex flex-col">
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

        <div className="grid grid-cols-7 gap-1 flex-1">
          {monthDaysTrimmed.map((day, index) => (
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
                      : day.getMonth() === month
                        ? "calendar-day"
                        : "calendar-day-muted"
                  }`}
                >
                  {day.getDate()}
                </div>
                {(hasEvents(day) || isToday(day)) && (
                  <div
                    className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  />
                )}
              </div>
            </Button3D>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === "year") {
    const baseDate = safeCurrentDate;
    const years = Array.from({ length: 2035 - 1950 + 1 }, (_, i) => 2035 - i);
    return (
      <div
        className="w-full overflow-y-auto hide-scrollbar flex flex-col items-start gap-2 py-1 px-3 pb-1"
        style={{ maxHeight: "312px" }}
        ref={yearsContainerRef}
      >
        {years.map((y) => {
          const date = new Date(baseDate);
          date.setFullYear(y);
          const isApplied =
            (currentDate && currentDate.getFullYear() === y) ||
            isSelected(date);
          return (
            <div key={y} ref={isApplied ? selectedYearRef : undefined}>
              <Button3D
                onClick={() => onDateSelect(date)}
                customAccentColor={calendarColors.accentColor}
                selected={isApplied}
                style={{
                  padding: "0.45rem 0.75rem",
                  minWidth: 180,
                  minHeight: 44,
                  fontSize: "0.85rem",
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{y}</span>
                  {y === todayYear && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    />
                  )}
                </div>
              </Button3D>
            </div>
          );
        })}
      </div>
    );
  }

  const base = safeCurrentDate;
  const year = base.getFullYear();
  const selectedMonth = base.getMonth();
  const monthIndices = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 flex-1">
        {monthIndices.map((m) => {
          const label = new Date(2000, m, 1).toLocaleString("en-US", {
            month: "short",
          });
          const date = new Date(year, m, 1);
          const monthHasEvents = events.some(
            (ev) => ev.date.getFullYear() === year && ev.date.getMonth() === m
          );
          const isApplied = m === selectedMonth;
          return (
            <Button3D
              key={m}
              selected={isApplied}
              onClick={() => onDateSelect(date)}
              customAccentColor={calendarColors.accentColor}
              style={{
                padding: "0.5rem 0.75rem",
                minWidth: 0,
                minHeight: 56,
                fontSize: "0.9rem",
                position: "relative",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span style={{ color: "var(--primary-text)" }}>{label}</span>
                {(monthHasEvents || m === todayMonth) && !isApplied && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--accent-color)" }}
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
