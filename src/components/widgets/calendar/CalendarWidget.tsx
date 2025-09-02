"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import { CalendarWidgetProps } from "@/interfaces/widgets";
import { useCalendarLogic } from "@/hooks/useCalendarLogic";
import CalendarHeader from "./CalendarHeader";
import CalendarWidgetDesktop from "./CalendarWidgetDesktop";

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

  React.useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate, setSelectedDate]);

  return (
    <WidgetBase
      style={{
        width: "100%",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
      }}
      className="lg:h-auto xl:h-[40vh]"
    >
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewModeChange={setViewMode}
      />

      <CalendarWidgetDesktop
        viewMode={viewMode}
        days={days}
        weekDays={weekDays}
        events={events}
        isToday={isToday}
        isSelected={isSelected}
        isCurrentMonth={isCurrentMonth}
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        onAddEvent={addEvent}
        onDeleteEvent={deleteEvent}
        showEventForm={showEventForm}
        onToggleEventForm={toggleEventForm}
      />
    </WidgetBase>
  );
}
