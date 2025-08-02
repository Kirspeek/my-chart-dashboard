"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import ContributionGraph from "./ContributionGraph";

interface ContributionGraphWidgetProps {
  title?: string;
}

export default function ContributionGraphWidget({
  title,
}: ContributionGraphWidgetProps) {
  return (
    <WidgetBase className="w-full flex flex-col items-center justify-center p-6">
      <ContributionGraph title={title} />
    </WidgetBase>
  );
}
