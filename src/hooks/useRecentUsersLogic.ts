"use client";

import { useMemo } from "react";
import { useTheme } from "./useTheme";

export function useRecentUsersLogic() {
  const { colors } = useTheme();

  const formatDate = useMemo(() => {
    return (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };
  }, []);

  const getStatusStyle = useMemo(() => {
    return (status: "active" | "inactive"): string => {
      if (status === "active") {
        return `bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400`;
      } else {
        return `bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400`;
      }
    };
  }, []);

  const getTextColor = useMemo(() => {
    return colors.primary;
  }, [colors.primary]);

  const getHeaderColor = useMemo(() => {
    return colors.secondary;
  }, [colors.secondary]);

  const getStatusColors = useMemo(() => {
    return {
      active: colors.accent.teal,
      inactive: colors.accent.red,
    };
  }, [colors.accent]);

  return {
    formatDate,
    getStatusStyle,
    getTextColor,
    getHeaderColor,
    getStatusColors,
  };
}
