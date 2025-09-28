"use client";

import React from "react";
import { Header as UIHeader } from "../../../../packages/ui-header/src";
import WidgetBase from "@/components/common/WidgetBase";

type SectionKey = "dashboard" | "projects" | "about" | "experience";

export default function HeaderWidget({
  defaultSection = "dashboard",
  onSectionChange,
  sections,
}: {
  defaultSection?: SectionKey;
  onSectionChange?: (s: SectionKey) => void;
  sections?: Array<{ key: SectionKey; label: string }>;
}) {
  return (
    <div className="widget-container">
      <WidgetBase className="rounded-2xl" style={{ padding: 16 }}>
        <UIHeader
          defaultSection={defaultSection}
          sections={sections}
          onSectionChange={onSectionChange}
          showThemeToggle
          contactEmail="cherepenko.iryna@gmail.com"
          contactLinks={[
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/irynacherepenko/",
              target: "_blank",
              rel: "noopener noreferrer",
            },
            {
              label: "GitHub",
              href: "https://github.com/Kirspeek",
              target: "_blank",
              rel: "noopener noreferrer",
            },
            {
              label: "Telegram",
              href: "https://t.me/kirstnd",
              target: "_blank",
              rel: "noopener noreferrer",
            },
          ]}
        />
      </WidgetBase>
    </div>
  );
}
