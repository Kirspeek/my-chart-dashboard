import { useState, useCallback, useEffect } from "react";
import { CardData } from "../../../../interfaces/wallet";

interface WalletCardData {
  card: CardData;
  balance: number;
  monthlySpending: number;
}

export const useWalletCardLogic = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [walletCards, setWalletCards] = useState<WalletCardData[]>([]);

  const handleCardClick = useCallback(() => {
    setSelectedCardIndex((prev) => (prev + 1) % walletCards.length);
  }, [walletCards.length]);

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

    // Listen for changes to wallet cards
    const handleStorageChange = () => {
      loadWalletCards();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes (in case storage event doesn't fire)
    const interval = setInterval(loadWalletCards, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // If no cards available, show empty state
  if (walletCards.length === 0) {
    return {
      currentCard: {
        number: "",
        name: "",
        exp: "",
        ccv: "",
        bank: "",
        scheme: "",
      },
      currentBalance: 0,
      monthlySpending: 0,
      selectedCardIndex: 0,
      handleCardClick,
      totalCards: 0,
      hasCards: false,
    };
  }

  const currentCard = walletCards[selectedCardIndex].card;
  const currentBalance = walletCards[selectedCardIndex].balance;
  const monthlySpending = walletCards[selectedCardIndex].monthlySpending;

  return {
    currentCard,
    currentBalance,
    monthlySpending,
    selectedCardIndex,
    handleCardClick,
    totalCards: walletCards.length,
    hasCards: true,
  };
};
