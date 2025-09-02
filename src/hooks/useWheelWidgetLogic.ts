import { useState, useCallback, useRef } from "react";
import { useWidgetState } from "../context/WidgetStateContext";
import { WalletCardData } from "@/interfaces/widgets";

export const useWheelWidgetLogic = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const { widgetState, setCurrentCard, getCurrentCardData } = useWidgetState();
  const lastClickTime = useRef(0);

  const handleCardClick = useCallback(() => {
    // Simple debounce to prevent rapid clicking
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      return;
    }
    lastClickTime.current = now;

    const activeCards = widgetState.cards.filter((data) => data.isActive);

    if (activeCards.length <= 1) {
      return; // No need to cycle if there's only one or no cards
    }

    // Find the current card index
    const currentCardId = widgetState.currentCardId;
    let currentIndex = activeCards.findIndex(
      (card) => card.cardId === currentCardId
    );

    // If current card not found, start from the beginning
    if (currentIndex === -1) {
      currentIndex = 0;
    }

    const nextIndex = (currentIndex + 1) % activeCards.length;
    const nextCard = activeCards[nextIndex];

    setSelectedCardIndex(nextIndex);
    setCurrentCard(nextCard.cardId);
  }, [widgetState.cards, widgetState.currentCardId, setCurrentCard]);

  // Get current card data
  const currentCard = getCurrentCardData();
  const currentCardData = currentCard
    ? {
        card: {
          number: currentCard.cardNumber,
          name: "Card Holder",
          exp: "12/25",
          ccv: "123",
        },
        balance: Math.floor(Math.random() * 10000) + 1000,
        monthlySpending: currentCard.monthlySpending.total,
      }
    : null;

  // Convert spending data to wallet card data format for compatibility
  const walletCards: WalletCardData[] = widgetState.cards
    .filter((card) => card.isActive)
    .map((card) => ({
      card: {
        number: card.cardNumber,
        name: "Card Holder",
        exp: "12/25",
        ccv: "123",
      },
      balance: Math.floor(Math.random() * 10000) + 1000,
      monthlySpending: card.monthlySpending.total,
    }));

  const hasCards = walletCards.length > 0;
  const totalCards = walletCards.length;

  return {
    selectedCardIndex,
    walletCards,
    handleCardClick,
    hasCards,
    totalCards,
    currentCard,
    currentCardData,
  };
};
