"use client";

import React from "react";
import { WidgetTitle } from "../../common";

interface RecentUsersHeaderProps {
  title: string;
}

export default function RecentUsersHeader({ title }: RecentUsersHeaderProps) {
  return <WidgetTitle title={title} variant="centered" size="md" />;
}
