"use client";

import React from "react";
import CardItem from "./CardItem";
import PocketContainer from "./PocketContainer";
import MainContainer from "./MainContainer";
import AddCardButton from "./AddCardButton";
import ClearWalletButton from "./ClearWalletButton";
import {
  WalletContainerProps,
  CardData,
  WALLET_CONSTANTS,
} from "../../../../interfaces/wallet";

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
  return (
    <div
      style={{
        position: "relative",
        width: WALLET_WIDTH,
        height: dynamicHeight,
        margin: "0 auto",
        marginTop: WALLET_CONSTANTS.TOP_PADDING,
      }}
    >
      <MainContainer width={WALLET_WIDTH} height={dynamicHeight} zIndex={1} />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
          paddingBottom: POCKET_HEIGHT,
          top: -40,
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
        width={WALLET_WIDTH}
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
