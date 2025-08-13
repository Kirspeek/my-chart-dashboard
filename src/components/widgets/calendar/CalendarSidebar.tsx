"use client";

import React, { useState } from "react";
import Button3D from "../../common/3DButton";
import type { CalendarEvent } from "../../../../interfaces/widgets";
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
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const { accent } = useTheme();
  const accentColor = accent.teal;

  const handleAddClick = () => {
    if (!selectedDate || !newEventTitle.trim()) return;

    onAddEvent({
      title: newEventTitle.trim(),
      description: newEventDescription.trim() || undefined,
      date: selectedDate,
    });

    setNewEventTitle("");
    setNewEventDescription("");
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
            <div className="text-4xl font-bold text-gray-800 mb-1 calendar-date-number">
              {selectedDateInfo.day}
            </div>
            <div className="text-sm font-medium text-gray-600 mb-2 calendar-date-day">
              {selectedDateInfo.dayName}
            </div>
            <div className="text-xs text-gray-500 calendar-date-month">
              {selectedDateInfo.month} {selectedDateInfo.year}
            </div>
          </div>
        )}

        {/* Events Section - Scrollable */}
        <div className="flex-1 min-h-0 mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2 flex-shrink-0 calendar-events-label">
            Events
          </div>
          <div className="overflow-y-auto max-h-full hide-scrollbar">
            <div className="space-y-2">
              {dayEvents.length === 0 ? (
                <div className="text-xs text-gray-500 italic">No events</div>
              ) : (
                dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {event.title}
                      </div>
                      {event.description && (
                        <div className="text-xs text-gray-600 truncate">
                          {event.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="ml-2 text-xs hover:opacity-70"
                      style={{ color: accentColor }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Event Section - Always at bottom */}
        <div className="flex-shrink-0">
          {showEventForm ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white/30 backdrop-blur-sm"
                style={{
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white/30 backdrop-blur-sm"
                style={{
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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
