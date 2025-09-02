"use client";

import React from "react";
import { RecentUsersWidgetProps } from "@/interfaces/widgets";
import WidgetBase from "../../common/WidgetBase";
import RecentUsersHeader from "./RecentUsersHeader";
import RecentUsersContainer from "./RecentUsersContainer";

export default function RecentUsersWidget({
  data,
  title,
}: RecentUsersWidgetProps) {
  return (
    <WidgetBase className="flex flex-col h-full">
      <RecentUsersHeader title={title} />
      <RecentUsersContainer data={data} />
    </WidgetBase>
  );
}
