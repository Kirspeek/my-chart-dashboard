"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useWalletLogic } from "@/hooks/wallet/useWalletLogic";
import { WALLET_CONSTANTS } from "@/constants/wallet";
import type {
  WidgetHeightContextType,
  WidgetHeightProviderProps,
} from "@/interfaces/context";

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

export const WidgetHeightProvider: React.FC<WidgetHeightProviderProps> = ({
  children,
}) => {
  const { cards } = useWalletLogic();
  const [walletHeight, setWalletHeight] = useState<number>(
    WALLET_CONSTANTS.WALLET_HEIGHT
  );

  // Track viewport to distinguish mobile vs desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  // Target height: apply 400px minimum only on desktop
  const targetHeight = useMemo(() => {
    return isMobile ? "82vh" : Math.max(walletHeight, 400);
  }, [walletHeight, isMobile]);

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
