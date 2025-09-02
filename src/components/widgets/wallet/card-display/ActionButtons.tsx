import React from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { ActionButtonsProps } from "@/interfaces/wallet";

export default function ActionButtons({
  isEditing,
  hasCardData,
  saving,
  bankDesign,
  onSave,
  onCancel,
  onToggleVisibility,
  isInfoVisible,
}: ActionButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        gap: "8px",
      }}
    >
      {isEditing && (
        <>
          <button
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(e);
            }}
            style={{
              width: 24,
              height: 24,
              border: "none",
              background: "transparent",
              color: bankDesign.textColor,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              opacity: saving ? 0.7 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={saving}
            title="Save"
          >
            {saving ? "⋯" : "✓"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
            style={{
              width: 24,
              height: 24,
              border: "none",
              background: "transparent",
              color: bankDesign.textColor,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Cancel"
          >
            ✕
          </button>
        </>
      )}

      {isEditing && hasCardData && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          style={{
            width: 24,
            height: 24,
            border: "none",
            background: "transparent",
            color: bankDesign.textColor,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.8,
            transition: "opacity 0.2s",
          }}
          title={isInfoVisible ? "Hide card info" : "Show card info"}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
        >
          {isInfoVisible ? (
            <EyeOff
              style={{ color: bankDesign.textColor, width: 16, height: 16 }}
            />
          ) : (
            <Eye
              style={{ color: bankDesign.textColor, width: 16, height: 16 }}
            />
          )}
        </button>
      )}

      <Image
        src="/logos/contactless-seeklogo.png"
        alt="Contactless Payment"
        width={20}
        height={20}
        style={{
          filter: "brightness(0) invert(1)",
          opacity: 0.9,
          width: "auto",
          height: "auto",
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
