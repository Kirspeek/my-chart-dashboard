"use client";

import React from "react";
import WalletContainer from "./WalletContainer";
import { useWalletLogic } from "../../../hooks/wallet/useWalletLogic";

export default function WalletWidget() {
  const walletLogic = useWalletLogic();

  return <WalletContainer {...walletLogic} />;
}
