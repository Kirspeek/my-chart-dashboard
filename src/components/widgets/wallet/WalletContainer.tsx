"use client";

import React, { useEffect } from "react";
import { WalletContainerProps, CardData } from "@/interfaces/wallet";
import { WALLET_CONSTANTS } from "@/constants";
import { useWidgetState } from "@/context/WidgetStateContext";
import MainContainer from "./MainContainer";
import PocketContainer from "./PocketContainer";
import CardItem from "./CardItem";
import AddCardButton from "./AddCardButton";
import ClearWalletButton from "./ClearWalletButton";

export default function WalletContainer({
  cards,
  editing,
  form,
  bankInfo,
  saving,
  fetchingBankData,
  canAddCard,
  dynamicHeight,
  WALLET_WIDTH,
  POCKET_HEIGHT,
  handleAdd,
  handleInput,
  handleSubmit,
  handleCardClick,
  getCardBankDesign,
  setEditing,
  clearWallet,
}: WalletContainerProps) {
  const { refreshSpendingData } = useWidgetState();

  useEffect(() => {
    refreshSpendingData(cards);
  }, [cards, refreshSpendingData]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: WALLET_WIDTH,
        height: dynamicHeight,
        margin: "0 auto",
        marginTop: WALLET_CONSTANTS.TOP_PADDING,
        transition: "height 0.3s ease-in-out",
      }}
    >
      <MainContainer width="100%" height={dynamicHeight} zIndex={1} />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
          paddingBottom: POCKET_HEIGHT,
          top: -40,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {cards.map((card: CardData, i: number) => {
          const isEditing = editing === i;
          const bankDesign = getCardBankDesign(card, i);

          return (
            <CardItem
              key={i}
              card={card}
              index={i}
              isEditing={isEditing}
              bankDesign={bankDesign}
              form={form}
              bankInfo={bankInfo}
              saving={saving}
              fetchingBankData={fetchingBankData}
              onCardClick={() => handleCardClick(i)}
              onInputChange={handleInput}
              onInputClick={(e) => e.stopPropagation()}
              onSave={handleSubmit}
              onCancel={() => setEditing(null)}
            />
          );
        })}
      </div>

      <PocketContainer
        width="100%"
        height={POCKET_HEIGHT}
        zIndex={15}
      />

      <AddCardButton
        onClick={handleAdd}
        disabled={!canAddCard}
        cardCount={cards.length}
        maxCards={20}
      />

      <ClearWalletButton onClick={clearWallet} />
    </div>
  );
}
