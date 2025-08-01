import React from "react";
import { CardData } from "../../../../interfaces/wallet";

interface WalletCardDisplayProps {
  card: CardData;
  balance: number;
  monthlySpending: number;
  onClick: () => void;
}

export default function WalletCardDisplay({
  card,
  balance,
  monthlySpending,
  onClick,
}: WalletCardDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMonthName = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[new Date().getMonth()];
  };

  // Get card display name - use bank name if available, otherwise use scheme
  const getCardDisplayName = () => {
    if (card.bank && card.bank.trim() !== "") {
      return card.bank;
    }
    if (card.scheme && card.scheme.trim() !== "") {
      return card.scheme;
    }
    return "Card";
  };

  return (
    <div
      className="relative bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: 200,
      }}
    >
      {/* Card Number */}
      <div className="text-white text-lg font-mono mb-4">
        {card.number || "**** ****"}
      </div>

      {/* Balance */}
      <div className="text-white mb-2">
        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
        <div className="text-sm opacity-90">Current Balance</div>
      </div>

      {/* Monthly Spending */}
      <div className="text-white text-sm opacity-90">
        {formatCurrency(monthlySpending)} spent in {getMonthName()}
      </div>

      {/* Card Info */}
      <div className="text-white text-xs opacity-70 mt-2">
        {getCardDisplayName()}
      </div>

      {/* Click indicator */}
      <div className="absolute top-4 right-4 text-white text-xs opacity-70">
        Click to change
      </div>
    </div>
  );
}
