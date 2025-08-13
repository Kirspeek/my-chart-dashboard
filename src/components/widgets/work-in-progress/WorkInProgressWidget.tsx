"use client";

import React from "react";
import WidgetBase from "../../common/WidgetBase";
import WidgetTitle from "../../common/WidgetTitle";
import { Settings, Code, Zap, Sparkles } from "lucide-react";

interface WorkInProgressWidgetProps {
  title?: string;
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}

export default function WorkInProgressWidget({
  title = "Widget in Progress",
  onOpenSidebar,
  showSidebarButton = false,
}: WorkInProgressWidgetProps) {
  return (
    <WidgetBase
      className="flex flex-col h-full group"
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <WidgetTitle title={title} subtitle="Coming soon..." />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-2 h-2 bg-[var(--accent-color)] rounded-full"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full"></div>
          <div className="absolute bottom-12 right-4 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
        </div>

        <div className="text-center relative z-10">
          {/* Main icon with animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Settings
                className="w-16 h-16 text-[var(--accent-color)] animate-spin group-hover:scale-110 transition-transform duration-300"
                style={{ animationDuration: "4s" }}
              />
              <div className="absolute inset-0 w-16 h-16 border-4 border-[var(--accent-color)] border-opacity-20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-8 left-8 opacity-30">
            <Code
              className="w-6 h-6 text-[var(--accent-color)] animate-bounce"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <div className="absolute top-8 right-8 opacity-30">
            <Zap
              className="w-6 h-6 text-[var(--accent-color)] animate-bounce"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <div className="absolute bottom-8 left-8 opacity-30">
            <Sparkles
              className="w-6 h-6 text-[var(--accent-color)] animate-bounce"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          {/* Main content */}
          <div className="relative">
            <p className="text-lg font-medium primary-text mb-3 group-hover:text-[var(--accent-color)] transition-colors duration-300">
              Widget in Work
            </p>
            <p className="text-sm secondary-text mb-4 max-w-xs mx-auto">
              This widget is currently under development and will be available
              soon
            </p>

            {/* Progress indicator */}
            <div className="w-32 h-1 bg-[var(--button-bg)] rounded-full mx-auto mb-4 overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] rounded-full animate-pulse"
                style={{ width: "65%" }}
              ></div>
            </div>

            {/* Status text */}
            <p className="text-xs secondary-text">Development progress: 65%</p>
          </div>
        </div>
      </div>
    </WidgetBase>
  );
}
