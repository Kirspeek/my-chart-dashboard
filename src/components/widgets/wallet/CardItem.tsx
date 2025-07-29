import React from "react";
import CardDisplay from "./CardDisplay";

interface CardItemProps {
  card: {
    number: string;
    name: string;
    exp: string;
    ccv: string;
    bank?: string;
    scheme?: string;
  };
  index: number;
  isEditing: boolean;
  bankDesign: {
    background: string;
    logo: string;
    logoColor: string;
    textColor: string;
    chipColor: string;
    logoUrl?: string | null;
  };
  form: {
    number: string;
    name: string;
    exp: string;
    ccv: string;
    scheme?: string;
  };
  bankInfo: {
    bank: string;
    scheme: string;
  };
  saving: boolean;
  fetchingBankData?: boolean;
  onCardClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick: (e: React.MouseEvent) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CARD_HEIGHT = 202;
const CARD_OFFSET = 40;

// Color palette for different cards
const cardColors = [
  "#F4E4A6",
  "#F4C2C2",
  "#B8D4E3",
  "#B8D4B8",
  "#D4B8F4",
  "#F4D4B8",
  "#B8E3F4",
  "#F4B8D4",
];

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
    : cardColors[index % cardColors.length];

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
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* Always show CardDisplay component, whether card is filled or empty */}
      <CardDisplay
        cardNumber={card.number}
        cardHolder={card.name}
        expirationDate={card.exp}
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
        onSave={onSave}
        onCancel={onCancel}
        fetchingBankData={fetchingBankData}
      />
    </div>
  );
}
