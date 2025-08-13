"use client";

import React, { useEffect, useMemo } from "react";
import WalletContainer from "./WalletContainer";
import { useWalletLogic } from "../../../hooks/wallet/useWalletLogic";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";
import SlideNavigation from "../../common/SlideNavigation";

export default function WalletWidget({
  currentSlide,
  setCurrentSlide,
}: {
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const walletLogic = useWalletLogic();
  const { updateWalletHeight } = useWidgetHeight();

  // Update the context with the current wallet height
  useEffect(() => {
    updateWalletHeight(walletLogic.dynamicHeight);
  }, [walletLogic.dynamicHeight, updateWalletHeight]);

  // Add smooth transition styling
  const containerStyle = useMemo(
    () => ({
      transition: "height 0.3s ease-in-out", // Smooth transition for height changes
      position: "relative" as const,
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <WalletContainer {...walletLogic} />
      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />
      )}
    </div>
  );
}
