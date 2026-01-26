"use client";

import React from "react";
import { Header as UIHeader } from "../../../../packages/ui-header/src";
import WidgetBase from "@/components/common/WidgetBase";
import SunMoonToggle from "@/components/common/SunMoonToggle";

type SectionKey = "dashboard";

export default function HeaderWidget({
  defaultSection = "dashboard",
  onSectionChange,
  onMenuClick,
  sections,
}: {
  defaultSection?: SectionKey;
  onSectionChange?: (s: SectionKey) => void;
  onMenuClick?: () => void;
  sections?: Array<{ key: SectionKey; label: string }>;
}) {
  return (
    <div className="widget-container">
      <WidgetBase className="rounded-2xl" style={{ padding: 16 }}>
        <UIHeader
          defaultSection={defaultSection}
          sections={sections}
          onSectionChange={onSectionChange}
          onMenuClick={onMenuClick}
          showThemeToggle
          themeToggleNode={<SunMoonToggle />}
          contactLinks={[
            {
              label: "Contact",
              href: "https://kirspeek.dev",
              target: "_blank",
              rel: "noopener noreferrer",
            },
          ]}
        />
      </WidgetBase>
    </div>
  );
}
