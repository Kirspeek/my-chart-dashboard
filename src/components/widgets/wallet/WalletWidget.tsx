"use client";

import React, { useEffect, useMemo } from "react";
import WalletContainer from "./WalletContainer";
import { useWalletLogic } from "../../../hooks/wallet/useWalletLogic";
import { useWidgetHeight } from "../../../context/WidgetHeightContext";

export default function WalletWidget() {
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
    }),
    []
  );

  return (
    <div style={containerStyle}>
      <WalletContainer {...walletLogic} />
    </div>
  );
}
