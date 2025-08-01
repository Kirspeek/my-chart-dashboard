"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useWalletLogic } from "../hooks/wallet/useWalletLogic";
import { WALLET_CONSTANTS } from "../constants/wallet";

interface WidgetHeightContextType {
  walletHeight: number;
  targetHeight: number;
  updateWalletHeight: (height: number) => void;
}

const WidgetHeightContext = createContext<WidgetHeightContextType | undefined>(
  undefined
);

export const useWidgetHeight = () => {
  const context = useContext(WidgetHeightContext);
  if (!context) {
    throw new Error(
      "useWidgetHeight must be used within a WidgetHeightProvider"
    );
  }
  return context;
};

interface WidgetHeightProviderProps {
  children: ReactNode;
}

export const WidgetHeightProvider: React.FC<WidgetHeightProviderProps> = ({
  children,
}) => {
  const { cards } = useWalletLogic();
  const [walletHeight, setWalletHeight] = useState<number>(
    WALLET_CONSTANTS.WALLET_HEIGHT
  );

  // Calculate dynamic height based on number of cards - using useMemo for immediate updates
  const calculatedWalletHeight = useMemo(() => {
    const baseHeight = WALLET_CONSTANTS.WALLET_HEIGHT;

    if (cards.length > 5) {
      const additionalCards = cards.length - 5;
      const additionalHeight = additionalCards * 30;
      return baseHeight + additionalHeight;
    }

    return baseHeight;
  }, [cards.length]);

  // Update wallet height immediately when calculated height changes
  useEffect(() => {
    setWalletHeight(calculatedWalletHeight);
  }, [calculatedWalletHeight]);

  // Target height for the other two widgets (wheel and bar chart) - using useMemo for immediate updates
  const targetHeight = useMemo(() => {
    return Math.max(walletHeight, 400); // Minimum 400px
  }, [walletHeight]);

  const updateWalletHeight = (height: number) => {
    setWalletHeight(height);
  };

  return (
    <WidgetHeightContext.Provider
      value={{
        walletHeight,
        targetHeight,
        updateWalletHeight,
      }}
    >
      {children}
    </WidgetHeightContext.Provider>
  );
};
