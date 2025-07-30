import React from "react";
import CardDisplay from "./CardDisplay";
import {
  CardItemProps,
  WALLET_CONSTANTS,
  CARD_COLORS,
} from "../../../../interfaces/wallet";

const CARD_HEIGHT = WALLET_CONSTANTS.CARD_HEIGHT;
const CARD_OFFSET = WALLET_CONSTANTS.CARD_OFFSET;

export default function CardItem({
  card,
  index,
  isEditing,
  bankDesign,
  form,
  bankInfo,
  saving,
  fetchingBankData,
  onCardClick,
  onInputChange,
  onInputClick,
  onSave,
  onCancel,
}: CardItemProps) {
  // Determine card background - use bank design if card has data OR if we're editing with bank info, otherwise use color palette
  const hasBankData = card.number || (isEditing && bankInfo.bank);
  const cardBackground = hasBankData
    ? bankDesign.background
    : CARD_COLORS[index % CARD_COLORS.length];

  // Determine text color - use bank design if card has data OR if we're editing with bank info, otherwise use dark text for pastel backgrounds
  const cardTextColor = hasBankData ? bankDesign.textColor : "#222";

  return (
    <div
      onClick={onCardClick}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        margin: "0 auto",
        height: CARD_HEIGHT,
        width: 320,
        borderRadius: 20,
        background: cardBackground,
        color: cardTextColor,
        cursor: "pointer",
        zIndex: isEditing ? 10 : index,
        transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
        transform: isEditing
          ? `translateY(-40px) scale(1.08)`
          : `translateY(${index * CARD_OFFSET}px) scale(1)`,
        boxShadow: isEditing
          ? "0 20px 40px rgba(0,0,0,0.3)"
          : "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <CardDisplay
        cardNumber={card.number}
        cardHolder={card.name}
        expirationDate={card.exp}
        ccv={card.ccv}
        bankName={card.bank}
        scheme={card.scheme}
        bankDesign={{
          ...bankDesign,
          background: cardBackground,
          textColor: cardTextColor,
        }}
        isEditing={isEditing}
        formInputs={isEditing ? form : undefined}
        onInputChange={isEditing ? onInputChange : undefined}
        onInputClick={isEditing ? onInputClick : undefined}
        bankInfo={isEditing ? bankInfo : undefined}
        saving={saving}
        fetchingBankData={fetchingBankData}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}
