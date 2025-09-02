"use client";

import React, { useEffect, useMemo } from "react";
import WalletContainer from "./WalletContainer";
import { useWalletLogic } from "@/hooks/wallet/useWalletLogic";
import { useWidgetHeight } from "@/context/WidgetHeightContext";
import SlideNavigation from "@/components/common/SlideNavigation";

export default function WalletWidget({
  currentSlide,
  setCurrentSlide,
}: {
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const walletLogic = useWalletLogic();
  const { updateWalletHeight } = useWidgetHeight();

  useEffect(() => {
    updateWalletHeight(walletLogic.dynamicHeight);
  }, [walletLogic.dynamicHeight, updateWalletHeight]);

  const containerStyle = useMemo(
    () => ({
      transition: "height 0.3s ease-in-out",
      position: "relative" as const,
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <WalletContainer {...walletLogic} />
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}
    </div>
  );
}
