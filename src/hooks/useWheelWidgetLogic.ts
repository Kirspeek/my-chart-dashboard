import { useState, useCallback, useEffect, useRef } from "react";
import { CardData } from "../../interfaces/wallet";
import { useWidgetState } from "../context/WidgetStateContext";
import { WalletCardData } from "../../interfaces/widgets";

export const useWheelWidgetLogic = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [walletCards, setWalletCards] = useState<WalletCardData[]>([]);
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
    console.log("Active cards available:", activeCards.length);
    console.log("Current card ID:", widgetState.currentCardId);

    if (activeCards.length <= 1) {
      console.log("No need to cycle - only one or no active cards");
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

    console.log(
      "Cycling from card",
      currentIndex,
      "to card",
      nextIndex,
      "of",
      activeCards.length
    );
    console.log("Next card:", nextCard.cardNumber, "ID:", nextCard.cardId);

    setSelectedCardIndex(nextIndex);
    setCurrentCard(nextCard.cardId);
  }, [widgetState.cards, widgetState.currentCardId, setCurrentCard]);

  // Load existing wallet cards from localStorage
  useEffect(() => {
    const loadWalletCards = () => {
      const saved = localStorage.getItem("wallet_cards");
      console.log("Loading wallet cards from localStorage:", saved);

      if (saved) {
        try {
          const cards: CardData[] = JSON.parse(saved);
          console.log("Parsed cards:", cards);

          // Filter out empty cards and create wallet card data
          const validCards = cards.filter(
            (card) => card.number && card.number.trim() !== ""
          );

          console.log("Valid cards found:", validCards.length);

          const walletCardData: WalletCardData[] = validCards.map((card) => ({
            card: {
              ...card,
              // Format card number to show last 4 digits
              number:
                card.number.length >= 4
                  ? `**** ${card.number.slice(-4)}`
                  : card.number,
            },
            balance: Math.floor(Math.random() * 10000) + 1000, // $1000-$11000
            monthlySpending: Math.floor(Math.random() * 8000) + 1000, // $1000-$9000
          }));

          console.log("Wallet card data created:", walletCardData);
          setWalletCards(walletCardData);
        } catch (error) {
          console.error("Error parsing wallet cards:", error);
          setWalletCards([]);
        }
      } else {
        console.log("No wallet cards found in localStorage");
        setWalletCards([]);
      }
    };

    loadWalletCards();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadWalletCards();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wallet-cards-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wallet-cards-updated", handleStorageChange);
    };
  }, []);

  // Get current card data
  const currentCard = getCurrentCardData();
  const currentCardData = currentCard
    ? {
        card: currentCard,
        balance: Math.floor(Math.random() * 10000) + 1000,
        monthlySpending: Math.floor(Math.random() * 8000) + 1000,
      }
    : null;

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
