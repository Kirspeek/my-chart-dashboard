"use client";

import React from "react";
import { AddCardButtonProps } from "../../../../interfaces/wallet";
import { useTheme } from "../../../hooks/useTheme";

export default function AddCardButton({
  onClick,
  disabled,
  cardCount = 0,
  maxCards = 20,
}: AddCardButtonProps) {
  const { colorsTheme } = useTheme();
  const walletColors = colorsTheme.widgets.wallet;

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
        background: walletColors.buttonColors.background,
        border: "none",
        color: "transparent",
        fontSize: 24,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: walletColors.buttonColors.shadow,
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
          e.currentTarget.style.background =
            walletColors.buttonColors.backgroundHover;
          e.currentTarget.style.boxShadow =
            walletColors.buttonColors.shadowHover;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(-50%) translateY(0)";
        e.currentTarget.style.background = walletColors.buttonColors.background;
        e.currentTarget.style.boxShadow = walletColors.buttonColors.shadow;
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateX(-50%) translateY(2px)";
          e.currentTarget.style.background =
            walletColors.buttonColors.backgroundActive;
          e.currentTarget.style.boxShadow =
            walletColors.buttonColors.shadowActive;
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateX(-50%) translateY(-1px)";
          e.currentTarget.style.background =
            walletColors.buttonColors.backgroundHover;
          e.currentTarget.style.boxShadow =
            walletColors.buttonColors.shadowHover;
        }
      }}
    >
      +
    </button>
  );
}
