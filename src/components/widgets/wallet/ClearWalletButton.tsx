"use client";

import React from "react";
import { Eraser } from "lucide-react";
import { ClearWalletButtonProps } from "@/interfaces/wallet";
import { useTheme } from "@/hooks/useTheme";

export default function ClearWalletButton({ onClick }: ClearWalletButtonProps) {
  const { colorsTheme } = useTheme();
  const walletColors = colorsTheme.widgets.wallet;

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
        background: walletColors.buttonColors.background,
        border: "none",
        color: walletColors.buttonColors.text,
        fontSize: 16,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        cursor: "pointer",
        zIndex: 20,
        boxShadow: walletColors.buttonColors.shadow,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="wallet-clear-button"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background =
          walletColors.buttonColors.backgroundHover;
        e.currentTarget.style.boxShadow = walletColors.buttonColors.shadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = walletColors.buttonColors.background;
        e.currentTarget.style.boxShadow = walletColors.buttonColors.shadow;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(2px)";
        e.currentTarget.style.background =
          walletColors.buttonColors.backgroundActive;
        e.currentTarget.style.boxShadow =
          walletColors.buttonColors.shadowActive;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background =
          walletColors.buttonColors.backgroundHover;
        e.currentTarget.style.boxShadow = walletColors.buttonColors.shadowHover;
      }}
    >
      <Eraser size={16} />
    </button>
  );
}
