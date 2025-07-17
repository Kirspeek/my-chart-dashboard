"use client";

import React from "react";
import { useTheme } from "../../../hooks";

interface RecentUsersHeaderProps {
  title: string;
}

export default function RecentUsersHeader({ title }: RecentUsersHeaderProps) {
  const { colors } = useTheme();

  return (
    <h3
      className="text-lg font-semibold mb-4"
      style={{
        color: colors.primary,
        fontFamily: "var(--font-mono)",
        fontWeight: 900,
        letterSpacing: "0.01em",
      }}
    >
      {title}
    </h3>
  );
}
