"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  CardData,
  CardSpendingData,
  WidgetState,
} from "@/interfaces/wallet";
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

  // Load initial spending data from localStorage
  useEffect(() => {
    const loadSpendingData = () => {
      const existingData = localStorage.getItem("card_spending_data");
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
        } catch {
          // Error loading spending data
        }
      }
    };

    loadSpendingData();
  }, []);

  const refreshSpendingData = useCallback((cards: CardData[]) => {
    const spendingData = updateSpendingData(cards);
    const aggregatedData = calculateAggregatedData(spendingData);

    setWidgetState((prev) => {
      // Preserve the current card selection if it still exists
      let currentCardId = prev.currentCardId;
      let currentCardNumber = prev.currentCardNumber;

      // Only reset to first active card if no card is currently selected or if the selected card is no longer active
      if (
        !currentCardId ||
        !spendingData.find(
          (card) => card.cardId === currentCardId && card.isActive
        )
      ) {
        const firstActiveCard = spendingData.find((card) => card.isActive);
        if (firstActiveCard) {
          // Auto-selecting first active card
          currentCardId = firstActiveCard.cardId;
          currentCardNumber = firstActiveCard.cardNumber;
        }
      } else {
        // Preserving current card selection
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

  // Listen for changes to wallet cards
  useEffect(() => {
    const handleStorageChange = () => {
      const walletCards = localStorage.getItem("wallet_cards");
      if (walletCards) {
        try {
          const cards: CardData[] = JSON.parse(walletCards);
          refreshSpendingData(cards);
        } catch {
          // Error parsing wallet cards
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check less frequently to avoid interfering with user selections
    const interval = setInterval(handleStorageChange, 5000); // Changed from 1000ms to 5000ms

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [refreshSpendingData]);

  const setCurrentCard = useCallback((cardId: string) => {
    setWidgetState((prev) => {
      const selectedCard = prev.cards.find((card) => card.cardId === cardId);
      if (selectedCard) {
        // User selected card
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
