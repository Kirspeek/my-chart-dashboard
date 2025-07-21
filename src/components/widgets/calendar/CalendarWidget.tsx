"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { CalendarWidgetProps } from "../../../../interfaces/widgets";
import { useCalendarLogic } from "src/hooks/useCalendarLogic";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import CalendarSidebar from "./CalendarSidebar";

export default function CalendarWidget({
  onDateSelect,
  initialDate,
}: CalendarWidgetProps) {
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
    deleteEvent,
    toggleEventForm,
  } = useCalendarLogic(onDateSelect, initialDate);

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays();

  return (
    <WidgetBase
      style={{
        width: "100%",
        height: "40vh",
        minHeight: 0,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewModeChange={setViewMode}
      />

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Left: Calendar Grid */}
        <div className="flex-1">
          <CalendarGrid
            days={days}
            weekDays={weekDays}
            events={events}
            viewMode={viewMode}
            isToday={isToday}
            isSelected={isSelected}
            isCurrentMonth={isCurrentMonth}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Right: Sidebar with selected date and events */}
        <div className="w-48 flex-shrink-0">
          <CalendarSidebar
            selectedDate={selectedDate}
            events={events}
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
            showEventForm={showEventForm}
            onToggleEventForm={toggleEventForm}
          />
        </div>
      </div>
    </WidgetBase>
  );
}
