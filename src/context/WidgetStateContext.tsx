"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CardData, CardSpendingData, WidgetState } from "@/interfaces/wallet";
import type {
  WidgetStateContextType,
  WidgetStateProviderProps,
} from "@/interfaces/context";
import {
  updateSpendingData,
  calculateAggregatedData,
} from "../services/spendingDataService";

const WidgetStateContext = createContext<WidgetStateContextType | undefined>(
  undefined
);

export const useWidgetState = () => {
  const context = useContext(WidgetStateContext);
  if (!context) {
    throw new Error("useWidgetState must be used within a WidgetStateProvider");
  }
  return context;
};

export const WidgetStateProvider: React.FC<WidgetStateProviderProps> = ({
  children,
}) => {
  const [widgetState, setWidgetState] = useState<WidgetState>({
    currentCardId: null,
    currentCardNumber: "",
    cards: [],
    aggregatedData: {
      totalSpending: 0,
      monthlySpending: 0,
      dailySpending: [],
    },
  });

  useEffect(() => {
    const loadSpendingData = () => {
      const existingData =
        typeof window !== "undefined"
          ? localStorage.getItem("card_spending_data")
          : null;
      if (existingData) {
        try {
          const spendingData: CardSpendingData[] = JSON.parse(existingData);
          const activeCards = spendingData.filter((data) => data.isActive);

          if (activeCards.length > 0) {
            const currentCard = activeCards[0];
            const aggregatedData = calculateAggregatedData(spendingData);

            setWidgetState({
              currentCardId: currentCard.cardId,
              currentCardNumber: currentCard.cardNumber,
              cards: spendingData,
              aggregatedData,
            });
          }
        } catch {}
      }
    };

    loadSpendingData();
  }, []);

  const refreshSpendingData = useCallback((cards: CardData[]) => {
    const spendingData = updateSpendingData(cards);
    const aggregatedData = calculateAggregatedData(spendingData);

    setWidgetState((prev) => {
      let currentCardId = prev.currentCardId;
      let currentCardNumber = prev.currentCardNumber;
      if (
        !currentCardId ||
        !spendingData.find(
          (card) => card.cardId === currentCardId && card.isActive
        )
      ) {
        const firstActiveCard = spendingData.find((card) => card.isActive);
        if (firstActiveCard) {
          currentCardId = firstActiveCard.cardId;
          currentCardNumber = firstActiveCard.cardNumber;
        }
      } else {
      }

      return {
        ...prev,
        currentCardId,
        currentCardNumber,
        cards: spendingData,
        aggregatedData,
      };
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const walletCards =
        typeof window !== "undefined"
          ? localStorage.getItem("wallet_cards")
          : null;
      if (walletCards) {
        try {
          const cards: CardData[] = JSON.parse(walletCards);
          refreshSpendingData(cards);
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(handleStorageChange, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [refreshSpendingData]);

  const setCurrentCard = useCallback((cardId: string) => {
    setWidgetState((prev) => {
      const selectedCard = prev.cards.find((card) => card.cardId === cardId);
      if (selectedCard) {
        return {
          ...prev,
          currentCardId: cardId,
          currentCardNumber: selectedCard.cardNumber,
        };
      }
      return prev;
    });
  }, []);

  const getCurrentCardData = useCallback(() => {
    return (
      widgetState.cards.find(
        (card) => card.cardId === widgetState.currentCardId
      ) || null
    );
  }, [widgetState.currentCardId, widgetState.cards]);

  const getAggregatedData = useCallback(() => {
    return widgetState.aggregatedData;
  }, [widgetState.aggregatedData]);

  const contextValue: WidgetStateContextType = {
    widgetState,
    setCurrentCard,
    refreshSpendingData,
    getCurrentCardData,
    getAggregatedData,
  };

  return (
    <WidgetStateContext.Provider value={contextValue}>
      {children}
    </WidgetStateContext.Provider>
  );
};
