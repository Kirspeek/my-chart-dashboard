"use client";

import React from "react";
import { AddCardButtonProps } from "../../../../interfaces/wallet";

export default function AddCardButton({
  onClick,
  disabled,
  cardCount = 0,
  maxCards = 20,
}: AddCardButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={
        disabled
          ? `Maximum cards reached (${maxCards})`
          : `Add new card (${cardCount}/${maxCards})`
      }
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "rgba(35, 35, 35, 0.07)",
        border: "none",
        color: "transparent",
        fontSize: 24,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 20,
        WebkitMask:
          "radial-gradient(circle at center, transparent 0, transparent 12px, black 12px)",
        mask: "radial-gradient(circle at center, transparent 0, transparent 12px, black 12px)",
      }}
      className="wallet-add-button"
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateX(-50%) translateY(-1px)";
          e.currentTarget.style.background = "rgba(35, 35, 35, 0.12)";
          e.currentTarget.style.boxShadow =
            "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(-50%) translateY(0)";
        e.currentTarget.style.background = "rgba(35, 35, 35, 0.07)";
        e.currentTarget.style.boxShadow =
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateX(-50%) translateY(2px)";
          e.currentTarget.style.background = "rgba(35, 35, 35, 0.18)";
          e.currentTarget.style.boxShadow =
            "inset 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateX(-50%) translateY(-1px)";
          e.currentTarget.style.background = "rgba(35, 35, 35, 0.12)";
          e.currentTarget.style.boxShadow =
            "0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
        }
      }}
    >
      +
    </button>
  );
}
