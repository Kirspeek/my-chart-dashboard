import React from "react";
import Image from "next/image";
import { CardDetailsSectionProps } from "@/interfaces/wallet";

export default function CardDetailsSection({
  isEditing,
  hasCardData,
  isInfoVisible,
  maskedDisplayHolder,
  maskedDisplayExp,
  displayScheme,
  formInputs,
  onInputChange,
  onInputClick,
  onExpirationDateChange,
  isExpirationDateValid,
  textColor,
  bankDesign,
}: CardDetailsSectionProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingTop: 20,
      }}
    >
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
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 8,
              fontWeight: 600,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Card Holder
          </div>
          {isEditing ? (
            hasCardData && !isInfoVisible ? (
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: textColor,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                  cursor: "pointer",
                }}
                onClick={onInputClick}
              >
                {maskedDisplayHolder}
              </div>
            ) : (
              <input
                name="name"
                value={formInputs?.name || ""}
                onChange={onInputChange}
                placeholder="CARD HOLDER"
                onClick={onInputClick}
                style={{
                  width: "100%",
                  fontSize: 12,
                  fontFamily: "'Space Mono', monospace",
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
            )
          ) : (
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                color: textColor,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {maskedDisplayHolder}
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
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 8,
              fontWeight: 600,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Valid Thru
          </div>
          {isEditing ? (
            hasCardData && !isInfoVisible ? (
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: textColor,
                  letterSpacing: 0.5,
                  cursor: "pointer",
                }}
                onClick={onInputClick}
              >
                {maskedDisplayExp}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <input
                  name="exp"
                  value={formInputs?.exp || ""}
                  onChange={onExpirationDateChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  onClick={onInputClick}
                  style={{
                    fontSize: 12,
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    border: "none",
                    background: "transparent",
                    color:
                      formInputs?.exp && !isExpirationDateValid
                        ? "#ff6b6b"
                        : bankDesign.textColor,
                    outline: "none",
                    letterSpacing: 0.5,
                    textAlign: "right",
                    minWidth: "5px",
                  }}
                  required
                />
                {formInputs?.exp && !isExpirationDateValid && (
                  <div
                    style={{
                      fontSize: 8,
                      color: "#ff6b6b",
                      marginTop: 2,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Invalid date
                  </div>
                )}
              </div>
            )
          ) : (
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                color: textColor,
                letterSpacing: 0.5,
              }}
            >
              {maskedDisplayExp}
            </div>
          )}
        </div>
      </div>

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
  );
}
