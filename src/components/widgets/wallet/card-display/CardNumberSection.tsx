import React from "react";
import { CardNumberSectionProps } from "@/interfaces/wallet";

export default function CardNumberSection({
  isEditing,
  hasCardData,
  isInfoVisible,
  maskedDisplayNumber,
  formInputs,
  onInputChange,
  onInputClick,
  textColor,
  bankDesign,
}: CardNumberSectionProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        flex: 1,
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          width: 40,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "none",
        }}
      >
        <svg
          width="36"
          height="26"
          viewBox="0 0 36 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="chipGold"
              x1="0"
              y1="0"
              x2="36"
              y2="26"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#f7e199" />
              <stop offset="0.5" stopColor="#d4af37" />
              <stop offset="1" stopColor="#bfa14a" />
            </linearGradient>
            <linearGradient
              id="chipShadow"
              x1="0"
              y1="0"
              x2="0"
              y2="26"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#000" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <rect
            x="1"
            y="1"
            width="34"
            height="24"
            rx="6"
            fill="url(#chipGold)"
            stroke="#bfa14a"
            strokeWidth="2"
          />
          <rect
            x="7"
            y="7"
            width="22"
            height="12"
            rx="3"
            fill="#e6c97b"
            stroke="#bfa14a"
            strokeWidth="1"
          />
          <rect x="13" y="7" width="2" height="12" rx="1" fill="#bfa14a" />
          <rect x="21" y="7" width="2" height="12" rx="1" fill="#bfa14a" />
        </svg>
      </div>

      {isEditing ? (
        hasCardData && !isInfoVisible ? (
          <div
            style={{
              flex: 1,
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: textColor,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
            onClick={onInputClick}
          >
            {maskedDisplayNumber}
          </div>
        ) : (
          <input
            name="number"
            value={formInputs?.number || ""}
            onChange={onInputChange}
            placeholder="1234 1234 1234 1234"
            maxLength={19}
            onClick={onInputClick}
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              letterSpacing: 1.5,
              border: "none",
              background: "transparent",
              color: bankDesign.textColor,
              outline: "none",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
            required
          />
        )
      ) : (
        <div
          style={{
            flex: 1,
            fontFamily: "'Space Mono', monospace",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: textColor,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {maskedDisplayNumber}
        </div>
      )}
    </div>
  );
}
