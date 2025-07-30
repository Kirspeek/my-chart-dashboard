import React, { useState, useEffect, useCallback } from "react";
import CardItem from "./CardItem";
import PocketContainer from "./PocketContainer";
import MainContainer from "./MainContainer";
import creditCardType from "credit-card-type";
import {
  CardData,
  BankInfo,
  CardForm,
  WALLET_CONSTANTS,
  EMPTY_CARD,
} from "../../../../interfaces/wallet";
import { fetchBankData, getBankDesign } from "../../../lib/walletApi";
import { BANK_CONSTANTS } from "../../../../apis";

const { WALLET_WIDTH, WALLET_HEIGHT, POCKET_HEIGHT } = WALLET_CONSTANTS;

export default function WalletWidget() {
  // Array of card data (empty by default)
  const [cards, setCards] = useState<CardData[]>(() => {
    const saved = localStorage.getItem("wallet_cards");
    if (saved) {
      try {
        return JSON.parse(saved) as CardData[];
      } catch {
        // fallback to empty if parse fails
      }
    }
    return [
      { ...EMPTY_CARD },
      { ...EMPTY_CARD },
      { ...EMPTY_CARD },
      { ...EMPTY_CARD },
      { ...EMPTY_CARD },
    ];
  });
  // Which card is being edited (index), or null
  const [editing, setEditing] = useState<number | null>(null);
  // Form state for editing
  const [form, setForm] = useState<CardForm>(EMPTY_CARD);
  // Store fetched bank/scheme info for the current form
  const [bankInfo, setBankInfo] = useState<BankInfo>({ bank: "", scheme: "" });
  // Loading state for Save button
  const [saving, setSaving] = useState(false);
  // Loading state for bank data fetching
  const [fetchingBankData, setFetchingBankData] = useState(false);

  // Find the next empty card index
  const nextEmptyIndex = cards.findIndex(
    (c: CardData) => !c.number && !c.name && !c.exp && !c.ccv
  );

  // Debounced bank data fetching
  const debouncedFetchBankData = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (cardNumber: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (cardNumber.length >= BANK_CONSTANTS.MIN_BIN_LENGTH) {
            setFetchingBankData(true);
            const bankData = await fetchBankData(cardNumber);
            if (bankData) {
              setBankInfo(bankData);
            }
            setFetchingBankData(false);
          }
        }, BANK_CONSTANTS.DEBOUNCE_DELAY);
      };
    })(),
    []
  );

  // Save cards to localStorage on every update
  useEffect(() => {
    localStorage.setItem("wallet_cards", JSON.stringify(cards));
  }, [cards]);

  // Handle Add button click
  const handleAdd = () => {
    if (nextEmptyIndex !== -1) {
      setEditing(nextEmptyIndex);
      setForm(EMPTY_CARD);
      setBankInfo({ bank: "", scheme: "" });
    }
  };

  // Handle input changes with real-time bank data fetching
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value;

    // Update form state
    setForm({ ...form, [name]: newValue });

    // Fetch bank data when card number changes
    if (name === "number") {
      debouncedFetchBankData(newValue);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing !== null) {
      setSaving(true);

      // Use existing bank info or fetch fresh data
      let finalBankInfo = { ...bankInfo };
      if (
        !finalBankInfo.bank &&
        form.number.length >= BANK_CONSTANTS.MIN_BIN_LENGTH
      ) {
        const bankData = await fetchBankData(form.number);
        if (bankData) {
          finalBankInfo = bankData;
        }
      }

      const updated = [...cards];
      updated[editing] = { ...form, ...finalBankInfo };
      setCards(updated);
      setEditing(null);
      setSaving(false);
      setForm(EMPTY_CARD);
      setBankInfo({ bank: "", scheme: "" });
    }
  };

  // Handle card click
  const handleCardClick = (index: number) => {
    if (editing === index) {
      setEditing(null);
    } else {
      setEditing(index);
      const card = cards[index];
      setForm({
        number: card.number,
        name: card.name,
        exp: card.exp,
        ccv: card.ccv,
        bank: card.bank || "",
        scheme: card.scheme || "",
      });
      setBankInfo({
        bank: card.bank || "",
        scheme: card.scheme || "",
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: WALLET_WIDTH,
        height: WALLET_HEIGHT,
        margin: "0 auto",
      }}
    >
      {/* Main wallet body */}
      <MainContainer width={WALLET_WIDTH} height={WALLET_HEIGHT} zIndex={1} />
      {/* Cards stack */}
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
          // Use bank info from form if editing, otherwise use card data
          const currentBank = isEditing ? bankInfo.bank : card.bank || "";
          const currentScheme = isEditing ? bankInfo.scheme : card.scheme || "";

          // Create a simple bank design object for compatibility
          const bankDesign = getBankDesign(
            currentBank,
            currentScheme,
            card.number
          );

          console.log(`Card ${i} Debug:`, {
            cardNumber: card.number,
            currentBank,
            currentScheme,
            bankDesign,
            isEditing,
            bankInfo,
          });

          // Debug logo URL specifically
          if (bankDesign.logoUrl) {
            console.log(`Card ${i} Logo URL:`, bankDesign.logoUrl);
          }

          // Debug bank design logic
          console.log(`Card ${i} Bank Design Logic:`, {
            bankName: currentBank,
            scheme: currentScheme,
            cardNumber: card.number,
            detectedCardType: creditCardType(card.number)[0]?.type,
            logo: bankDesign.logo,
            logoUrl: bankDesign.logoUrl,
            isEmpty: !currentBank && !card.number,
            willShowBank: !currentBank,
          });

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
      {/* Bottom pocket box - now overlapping all content */}
      <PocketContainer
        width={WALLET_WIDTH}
        height={POCKET_HEIGHT}
        zIndex={10}
      />
      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={nextEmptyIndex === -1}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: nextEmptyIndex === -1 ? "#666" : "#4CAF50",
          border: "none",
          color: "white",
          fontSize: 24,
          cursor: nextEmptyIndex === -1 ? "not-allowed" : "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          zIndex: 11, // Higher than the pocket container
        }}
        onMouseEnter={(e) => {
          if (nextEmptyIndex !== -1) {
            e.currentTarget.style.transform = "translateX(-50%) scale(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(-50%) scale(1)";
        }}
      >
        +
      </button>
    </div>
  );
}
