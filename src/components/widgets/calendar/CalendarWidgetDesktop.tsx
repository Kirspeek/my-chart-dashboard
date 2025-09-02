"use client";

import React from "react";
import CalendarGrid from "./components/CalendarGrid";
import CalendarSidebar from "./components/CalendarSidebar";
import type { CalendarEvent } from "../../../../interfaces/widgets";

interface CalendarWidgetDesktopProps {
  viewMode: "month" | "week" | "day";
  days: Date[];
  weekDays: string[];
  events: CalendarEvent[];
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
  onDeleteEvent: (eventId: string) => void;
  showEventForm: boolean;
  onToggleEventForm: () => void;
}

export default function CalendarWidgetDesktop(
  props: CalendarWidgetDesktopProps
) {
  const {
    viewMode,
    days,
    weekDays,
    events,
    isToday,
    isSelected,
    isCurrentMonth,
    onDateSelect,
    selectedDate,
    onAddEvent,
    onDeleteEvent,
    showEventForm,
    onToggleEventForm,
  } = props;

  return (
    <div className="flex flex-row flex-1 gap-4 min-h-0">
      <div className="flex-1 min-w-0">
        <CalendarGrid
          days={days}
          weekDays={weekDays}
          events={events}
          viewMode={viewMode}
          isToday={isToday}
          isSelected={isSelected}
          isCurrentMonth={isCurrentMonth}
          onDateSelect={onDateSelect}
        />
      </div>
      <div className="w-[16rem] lg:w-[18rem] flex-none">
        <CalendarSidebar
          selectedDate={selectedDate}
          events={events}
          onAddEvent={onAddEvent}
          onDeleteEvent={onDeleteEvent}
          showEventForm={showEventForm}
          onToggleEventForm={onToggleEventForm}
        />
      </div>
    </div>
  );
}
