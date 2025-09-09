import { useState, useCallback } from "react";
import type {
  CalendarState,
  CalendarActions,
  CalendarEvent,
} from "@/interfaces/widgets";

export function useCalendarLogic(
  onDateSelect?: (date: Date) => void,
  initialDate?: Date
): CalendarState & CalendarActions {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "year">(
    "month"
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month") {
        newDate.setMonth(prev.getMonth() - 1);
      } else if (viewMode === "week") {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() - 1);
      }
      return newDate;
    });
  }, [viewMode]);

  const goToNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month") {
        newDate.setMonth(prev.getMonth() + 1);
      } else if (viewMode === "week") {
        newDate.setDate(prev.getDate() + 7);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  }, [viewMode]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const getDaysInMonth = useCallback(
    (date: Date): Date[] => {
      if (viewMode === "day") {
        // For day view, just return the selected day
        return [date];
      }

      if (viewMode === "week") {
        // For week view, return the 7 days of the current week
        const days: Date[] = [];
        const startOfWeek = new Date(date);
        const dayOfWeek = date.getDay();
        startOfWeek.setDate(date.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          days.push(day);
        }
        return days;
      }

      // Month view (default) - STRICTLY 5 weeks only
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();

      // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfWeek = firstDay.getDay();

      const days: Date[] = [];

      // Add days from previous month to fill the first week
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevMonthDay = new Date(year, month, -i);
        days.push(prevMonthDay);
      }

      // Add days from current month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }

      // Add days from next month to fill exactly 5 weeks (35 days total) - NO MORE
      const remainingDays = 35 - days.length; // 5 rows * 7 days = 35
      for (let day = 1; day <= remainingDays; day++) {
        days.push(new Date(year, month + 1, day));
      }

      // Ensure we never return more than 35 days
      return days.slice(0, 35);
    },
    [viewMode]
  );

  const getWeekDays = useCallback((): string[] => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }, []);

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isSelected = useCallback(
    (date: Date): boolean => {
      if (!selectedDate) return false;
      return date.toDateString() === selectedDate.toDateString();
    },
    [selectedDate]
  );

  const isCurrentMonth = useCallback(
    (date: Date): boolean => {
      return (
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    },
    [currentDate]
  );

  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      return events.filter(
        (event) => event.date.toDateString() === date.toDateString()
      );
    },
    [events]
  );

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    setShowEventForm(false);
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }, []);

  const toggleEventForm = useCallback(() => {
    setShowEventForm((prev) => !prev);
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      setCurrentDate(date);
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    },
    [onDateSelect]
  );

  const setYear = useCallback((year: number) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setFullYear(year);
      return d;
    });
    setSelectedDate((prev) => {
      const base = prev ?? new Date();
      const d = new Date(base);
      d.setFullYear(year);
      return d;
    });
  }, []);

  return {
    currentDate,
    selectedDate,
    viewMode,
    events,
    showEventForm,
    setSelectedDate: handleDateSelect,
    setViewMode,
    setYear,
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
    getEventsForDate,
    toggleEventForm,
  };
}
