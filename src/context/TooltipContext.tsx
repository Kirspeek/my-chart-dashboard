"use client";

import React, { createContext, useContext, useState } from "react";
import type {
  TooltipContextType,
  TooltipData,
  TooltipProviderProps,
} from "@/interfaces/context";

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const showTooltip = (data: TooltipData) => {
    setTooltip(data);
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip, tooltip }}>
      {children}
      {/* Global Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            background: "#fff",
            color: "#000",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            padding: "12px 18px",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 14,
            pointerEvents: "none",
            zIndex: 9999,
            minWidth: 200,
            border: "1px solid rgba(0,0,0,0.1)",
            maxWidth: 300,
          }}
        >
          {tooltip.title && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#000",
                  marginBottom: 4,
                }}
              >
                {tooltip.title}
              </div>
              {tooltip.subtitle && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  {tooltip.subtitle}
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {tooltip.color && (
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  background: tooltip.color,
                  borderRadius: "4px",
                  marginRight: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              />
            )}
            <div style={{ flex: 1 }}>{tooltip.content}</div>
          </div>
        </div>
      )}
    </TooltipContext.Provider>
  );
}
