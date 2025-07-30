import React from "react";
import { BankInfoDisplayProps } from "../../../../../interfaces/wallet";

export default function BankInfoDisplay({
  isEditing,
  currentBankName,
  scheme,
  bankInfo,
  fetchingBankData,
  textColor,
}: BankInfoDisplayProps) {
  if (isEditing && (bankInfo?.bank || bankInfo?.scheme)) {
    return (
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 10,
          color: "rgba(255,255,255,0.8)",
          textAlign: "center",
          marginTop: -8,
        }}
      >
        {fetchingBankData && !bankInfo.bank && !bankInfo.scheme ? (
          <span>Loading...</span>
        ) : (
          <>
            {bankInfo.bank}{" "}
            {bankInfo.scheme && `(${bankInfo.scheme.toUpperCase()})`}
          </>
        )}
      </div>
    );
  }

  if (!isEditing && (currentBankName || scheme)) {
    return (
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 10,
          color: textColor,
          textAlign: "center",
          marginTop: -8,
        }}
      >
        {currentBankName} {scheme && `(${scheme.toUpperCase()})`}
      </div>
    );
  }

  return null;
}
