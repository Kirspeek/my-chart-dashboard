"use client";

import React, { useState } from "react";
import Button3D from "../../common/3DButton";
import type { CalendarEvent } from "@/interfaces/widgets";
import { useTheme } from "@/hooks/useTheme";

interface CalendarSidebarProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
  onDeleteEvent: (eventId: string) => void;
  showEventForm: boolean;
  onToggleEventForm: () => void;
}

export default function CalendarSidebar({
  selectedDate,
  events,
  onAddEvent,
  onDeleteEvent,
  showEventForm,
  onToggleEventForm,
}: CalendarSidebarProps) {
  const [newEventText, setNewEventText] = useState("");
  const { colorsTheme } = useTheme();
  const calendarColors = colorsTheme.widgets.calendar;

  const handleAddClick = () => {
    if (!selectedDate || !newEventText.trim()) return;

    onAddEvent({
      title: newEventText.trim(),
      description: undefined,
      date: selectedDate,
    });

    setNewEventText("");
  };

  const formatDate = (date: Date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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
    <>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="flex flex-col h-full">
        {/* Selected Date Display */}
        {selectedDateInfo && (
          <div className="text-center mb-4 flex-shrink-0 mt-4">
            <div
              className="text-4xl font-bold mb-1 calendar-date-number"
              style={{ color: calendarColors.textColors.primary }}
            >
              {selectedDateInfo.day}
            </div>
            <div
              className="text-sm font-medium mb-2 calendar-date-day"
              style={{ color: calendarColors.textColors.secondary }}
            >
              {selectedDateInfo.dayName}
            </div>
            <div
              className="text-xs calendar-date-month"
              style={{ color: calendarColors.textColors.muted }}
            >
              {selectedDateInfo.month} {selectedDateInfo.year}
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 mb-4">
          <div
            className="text-sm font-semibold mb-2 flex-shrink-0 calendar-events-label"
            style={{ color: calendarColors.textColors.label }}
          >
            Events
          </div>
          <div className="overflow-y-auto max-h-full hide-scrollbar">
            <div className="space-y-2">
              {dayEvents.length === 0 ? (
                <div
                  className="text-xs italic"
                  style={{ color: calendarColors.textColors.muted }}
                >
                  No events
                </div>
              ) : (
                dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{
                      backgroundColor: calendarColors.backgroundColors.event,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: calendarColors.textColors.primary }}
                      >
                        {event.title}
                      </div>
                      {event.description && (
                        <div
                          className="text-xs truncate"
                          style={{ color: calendarColors.textColors.secondary }}
                        >
                          {event.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="ml-2 text-xs hover:opacity-70"
                      style={{ color: calendarColors.accentColor }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {showEventForm ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="add event"
                value={newEventText}
                onChange={(e) => setNewEventText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddClick();
                }}
                className="w-full px-3 py-2 text-sm rounded-full focus:outline-none backdrop-blur-sm"
                style={{
                  border: `2px solid ${calendarColors.borderColors.input}`,
                  backgroundColor: calendarColors.backgroundColors.input,
                  boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.06)",
                  color: calendarColors.textColors.primary,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    calendarColors.borderColors.focus;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${calendarColors.borderColors.focus}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    calendarColors.borderColors.input;
                  e.currentTarget.style.boxShadow =
                    "0 2px 6px 0 rgba(0, 0, 0, 0.06)";
                }}
              />
              <div className="flex gap-1">
                <Button3D
                  onClick={handleAddClick}
                  style={{
                    padding: "0.25rem 0.5rem",
                    minWidth: "auto",
                    minHeight: "auto",
                    fontSize: "0.75rem",
                  }}
                >
                  Add
                </Button3D>
                <Button3D
                  onClick={onToggleEventForm}
                  style={{
                    padding: "0.25rem 0.5rem",
                    minWidth: "auto",
                    minHeight: "auto",
                    fontSize: "0.75rem",
                  }}
                >
                  Cancel
                </Button3D>
              </div>
            </div>
          ) : (
            <Button3D
              onClick={onToggleEventForm}
              style={{
                padding: "0.5rem",
                minWidth: "auto",
                minHeight: "auto",
                fontSize: "0.75rem",
              }}
            >
              + Add Event
            </Button3D>
          )}
        </div>
      </div>
    </>
  );
}
