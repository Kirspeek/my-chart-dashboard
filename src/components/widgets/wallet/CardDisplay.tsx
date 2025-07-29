import React from "react";
import Image from "next/image";

interface CardDisplayProps {
  // Card data
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  ccv?: string;
  bankName?: string;
  scheme?: string;

  // Bank design info
  bankDesign: {
    background: string;
    logo: string;
    logoColor: string;
    textColor: string;
    chipColor: string;
  };
  bankLogoUrl?: string | null;

  // Display mode
  isEditing?: boolean;

  // Form inputs (for editing mode)
  formInputs?: {
    number: string;
    name: string;
    exp: string;
    ccv: string;
    scheme?: string;
  };

  // Event handlers (for editing mode)
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick?: (e: React.MouseEvent) => void;

  // Bank info display
  bankInfo?: {
    bank: string;
    scheme: string;
  };

  // Action buttons props
  saving?: boolean;
  onSave?: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export default function CardDisplay({
  cardNumber,
  cardHolder,
  expirationDate,
  bankName,
  scheme,
  bankDesign,
  bankLogoUrl,
  isEditing = false,
  formInputs,
  onInputChange,
  onInputClick,
  bankInfo,
  saving,
  onSave,
  onCancel,
}: CardDisplayProps) {
  // Use form values if editing, otherwise use card values
  const displayNumber = isEditing
    ? formInputs?.number || cardNumber
    : cardNumber;
  const displayHolder = isEditing ? formInputs?.name || cardHolder : cardHolder;
  const displayExp = isEditing
    ? formInputs?.exp || expirationDate
    : expirationDate;
  const displayScheme = isEditing ? formInputs?.scheme || scheme : scheme;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 20,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top section with bank logo and contactless symbol */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        {/* Bank Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {bankLogoUrl ? (
            <Image
              src={bankLogoUrl}
              alt={bankName || "Bank"}
              width={24}
              height={24}
              style={{
                filter: "brightness(0) invert(1)",
                opacity: 0.9,
              }}
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: bankDesign.logoColor,
                letterSpacing: 0.5,
              }}
            >
              {bankDesign.logo}
            </div>
          )}
        </div>

        {/* Contactless Symbol */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "8px",
            gap: "8px",
          }}
        >
          {/* Action buttons for editing mode */}
          {isEditing && (
            <>
              <button
                type="button"
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
                  cursor: saving ? "not-allowed" : "pointer",
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

          <Image
            src="/logos/contactless-seeklogo.png"
            alt="Contactless Payment"
            width={20}
            height={20}
            style={{
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
            }}
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Middle section with chip and card number */}
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
        {/* EMV Chip */}
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
            <rect x="7" y="12" width="22" height="2" rx="1" fill="#bfa14a" />
            <rect
              x="7"
              y="10"
              width="22"
              height="1"
              rx="0.5"
              fill="#bfa14a"
              fillOpacity="0.7"
            />
            <rect
              x="7"
              y="15"
              width="22"
              height="1"
              rx="0.5"
              fill="#bfa14a"
              fillOpacity="0.7"
            />
            <rect
              x="10"
              y="7"
              width="1"
              height="12"
              rx="0.5"
              fill="#bfa14a"
              fillOpacity="0.7"
            />
            <rect
              x="25"
              y="7"
              width="1"
              height="12"
              rx="0.5"
              fill="#bfa14a"
              fillOpacity="0.7"
            />
            <rect
              x="1"
              y="1"
              width="34"
              height="24"
              rx="6"
              fill="url(#chipShadow)"
            />
          </svg>
        </div>

        {/* Card Number */}
        {isEditing ? (
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
        ) : (
          <div
            style={{
              flex: 1,
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: bankDesign.textColor,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {displayNumber}
          </div>
        )}
      </div>

      {/* Bank info display */}
      {isEditing && bankInfo?.bank && (
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 10,
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            marginTop: -8,
          }}
        >
          {bankInfo.bank}{" "}
          {bankInfo.scheme && `(${bankInfo.scheme.toUpperCase()})`}
        </div>
      )}

      {/* Bottom section with card details */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingTop: 20,
        }}
      >
        {/* First row: Card holder and expiration date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 12,
            paddingRight: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flex: 1,
              minWidth: "140px",
              maxWidth: "180px",
            }}
          >
            {/* Card Holder Label */}
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 8,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Card Holder
            </div>
            {/* Card Holder Name/Input */}
            {isEditing ? (
              <input
                name="name"
                value={formInputs?.name || ""}
                onChange={onInputChange}
                placeholder="CARD HOLDER"
                onClick={onInputClick}
                style={{
                  width: "100%",
                  fontSize: 10,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  border: "none",
                  background: "transparent",
                  color: bankDesign.textColor,
                  outline: "none",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  padding: "0",
                  margin: "0",
                  minWidth: "120px",
                  maxWidth: "100%",
                  overflow: "visible",
                }}
                required
              />
            ) : (
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: bankDesign.textColor,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {displayHolder}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 1,
              position: "absolute",
              right: 20,
            }}
          >
            {/* Valid Thru Label */}
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 8,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Valid Thru
            </div>
            {/* Expiration Date/Input */}
            {isEditing ? (
              <input
                name="exp"
                value={formInputs?.exp || ""}
                onChange={onInputChange}
                placeholder="MM/YY"
                maxLength={5}
                onClick={onInputClick}
                style={{
                  fontSize: 12,
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  border: "none",
                  background: "transparent",
                  color: bankDesign.textColor,
                  outline: "none",
                  letterSpacing: 0.5,
                  textAlign: "right",
                  minWidth: "5px",
                }}
                required
              />
            ) : (
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: bankDesign.textColor,
                  letterSpacing: 0.5,
                }}
              >
                {displayExp}
              </div>
            )}
          </div>
        </div>

        {/* Second row: Payment Network Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 35,
              borderRadius: 4,
              overflow: "hidden",
              background: "transparent",
              padding: 0,
            }}
          >
            {displayScheme?.toLowerCase() === "visa" ? (
              <Image
                src="/logos/visa-logo.png"
                alt="VISA"
                width={60}
                height={35}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
                priority
              />
            ) : displayScheme?.toLowerCase() === "mastercard" ? (
              <Image
                src="/logos/mastercard.png"
                alt="Mastercard"
                width={60}
                height={35}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
                priority
              />
            ) : displayScheme?.toLowerCase() === "amex" ? (
              <Image
                src="/logos/amex-logo.svg"
                alt="American Express"
                width={60}
                height={35}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
                priority
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    textAlign: "center",
                    lineHeight: 1,
                  }}
                >
                  {displayScheme ? displayScheme.toUpperCase() : "CARD"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
