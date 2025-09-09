import { useState, useMemo, useEffect } from "react";
import { CardData } from "@/interfaces/wallet";
import { EMPTY_CARD } from "../../data";

export const useCardManagement = () => {
  const [cards, setCards] = useState<CardData[]>(() =>
    Array(5)
      .fill(null)
      .map(() => ({ ...EMPTY_CARD }))
  );

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("wallet_cards")
        : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CardData[];
        setCards(parsed);
      } catch {}
    }
  }, []);

  const nextEmptyIndex = useMemo(() => {
    return cards.findIndex(
      (c: CardData) => !c.number && !c.name && !c.exp && !c.ccv
    );
  }, [cards]);

  const canAddCard = useMemo(() => {
    return nextEmptyIndex !== -1 || cards.length < 20;
  }, [nextEmptyIndex, cards.length]);

  const updateCard = (index: number, updates: Partial<CardData>) => {
    if (index >= 0 && index < cards.length) {
      const updatedCards = [...cards];
      updatedCards[index] = {
        ...updatedCards[index],
        ...updates,
      };
      setCards(updatedCards);
    }
  };

  const updateCardField = (
    index: number,
    field: keyof CardData,
    value: string
  ) => {
    if (index >= 0 && index < cards.length) {
      const updatedCards = [...cards];
      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value,
      };
      setCards(updatedCards);
    }
  };

  const updateCardConditionally = (
    index: number,
    updates: Partial<CardData>
  ) => {
    if (index >= 0 && index < cards.length) {
      const updatedCards = [...cards];
      const currentCard = updatedCards[index];

      const filteredUpdates = Object.entries(updates).reduce(
        (acc, [key, value]) => {
          if (value && value.trim() !== "") {
            acc[key as keyof CardData] = value;
          }
          return acc;
        },
        {} as Partial<CardData>
      );

      updatedCards[index] = {
        ...currentCard,
        ...filteredUpdates,
      };
      setCards(updatedCards);
    }
  };

  const updateCardDeep = (index: number, updates: Partial<CardData>) => {
    if (index >= 0 && index < cards.length) {
      const updatedCards = [...cards];
      const currentCard = updatedCards[index];

      updatedCards[index] = {
        ...currentCard,
        ...updates,
      };
      setCards(updatedCards);
    }
  };

  const clearWallet = () => {
    const emptyCards = Array(5)
      .fill(null)
      .map(() => ({ ...EMPTY_CARD }));
    setCards(emptyCards);
    if (typeof window !== "undefined") {
      localStorage.removeItem("wallet_cards");
    }
  };

  const removeCard = (index: number) => {
    if (index >= 0 && index < cards.length) {
      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
    }
  };

  return {
    cards,
    setCards,
    nextEmptyIndex,
    canAddCard,
    clearWallet,
    removeCard,
    updateCard,
    updateCardField,
    updateCardConditionally,
    updateCardDeep,
  };
};
