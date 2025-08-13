"use client";

import React from "react";
import { Eraser } from "lucide-react";
import { ClearWalletButtonProps } from "../../../../interfaces/wallet";

export default function ClearWalletButton({ onClick }: ClearWalletButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(35, 35, 35, 0.07)",
        border: "none",
        color: "white",
        fontSize: 16,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        cursor: "pointer",
        zIndex: 20,
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="wallet-clear-button"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background = "rgba(35, 35, 35, 0.12)";
        e.currentTarget.style.boxShadow =
          "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(35, 35, 35, 0.07)";
        e.currentTarget.style.boxShadow =
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(2px)";
        e.currentTarget.style.background = "rgba(35, 35, 35, 0.18)";
        e.currentTarget.style.boxShadow =
          "inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background = "rgba(35, 35, 35, 0.12)";
        e.currentTarget.style.boxShadow =
          "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
      }}
    >
      <Eraser size={16} />
    </button>
  );
}
