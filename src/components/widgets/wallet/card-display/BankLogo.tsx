import React from "react";
import Image from "next/image";
import { BankLogoExtendedProps } from "@/interfaces/wallet";
import TextLogo from "./TextLogo";

export default function BankLogo({
  currentBankName,
  bankDesign,
  externalLogoLoaded,
  externalLogoFailed,
  setExternalLogoLoaded,
  setExternalLogoFailed,
}: BankLogoExtendedProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        position: "relative",
        width: 24,
        height: 24,
      }}
    >
      {currentBankName ? (
        <>
          {(!externalLogoLoaded || externalLogoFailed) && (
            <div
              style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 8,
                  color: bankDesign.logoColor,
                  letterSpacing: 0.5,
                  textAlign: "center",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                {bankDesign.logo.slice(0, 3).toUpperCase()}
              </div>
            </div>
          )}

          {bankDesign.logoUrl &&
            bankDesign.logoUrl !== null &&
            !externalLogoFailed && (
              <Image
                src={bankDesign.logoUrl}
                alt={currentBankName || "Bank"}
                width={24}
                height={24}
                style={{
                  filter: "brightness(0) invert(1)",
                  opacity: 0.9,
                  objectFit: "contain",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 1,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  setExternalLogoFailed(true);
                }}
                onLoad={() => {
                  setTimeout(() => {
                    setExternalLogoLoaded(true);
                  }, 100);
                }}
              />
            )}
        </>
      ) : (
        <TextLogo text="BANK" color={bankDesign.logoColor} />
      )}
    </div>
  );
}
