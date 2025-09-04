"use client";

import React from "react";
import { WidgetTitle } from "@/components/common";
import type { RecentUsersHeaderProps } from "@/interfaces/components";

export default function RecentUsersHeader({ title }: RecentUsersHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
