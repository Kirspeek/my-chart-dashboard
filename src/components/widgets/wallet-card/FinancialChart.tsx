import React, { useState } from "react";
import { CardData } from "../../../../interfaces/wallet";

interface FinancialChartProps {
  balance: number;
  card: CardData;
  onClick: () => void;
}

type TimePeriod = "D" | "W" | "M" | "Y";

export default function FinancialChart({
  balance,
  card,
  onClick,
}: FinancialChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Y");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Generate sample monthly data
  const monthlyData = [
    { month: "Jan", income: 25000, expenses: 18000 },
    { month: "Feb", income: 22000, expenses: 16000 },
    { month: "Mar", income: 28000, expenses: 19000 },
    { month: "Apr", income: 24000, expenses: 17000 },
    { month: "May", income: 26000, expenses: 18500 },
    { month: "Jun", income: 23000, expenses: 16500 },
  ];

  const maxValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expenses))
  );

  const periods: TimePeriod[] = ["D", "W", "M", "Y"];

  return (
    <div
      className="relative rounded-[2.5rem] border p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
      onClick={onClick}
      style={{
        background: "rgba(var(--background-rgb), 0.65)",
        borderColor: "rgba(0,0,0,0.06)",
        boxShadow:
          "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)",
        borderWidth: 2,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        minHeight: 200,
      }}
    >
      {/* Card Number */}
      <div className="text-[#232323] text-lg font-mono mb-4">
        {card.number || "**** ****"}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3
            className="text-[#232323] text-lg font-semibold"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Total Income
          </h3>
          <div
            className="text-[#232323] text-2xl font-bold"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formatCurrency(balance)}
          </div>
        </div>
        <div className="text-[#232323]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 17L9 11L13 15L21 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 7V13H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2 mb-4">
        {periods.map((period) => (
          <button
            key={period}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPeriod(period);
            }}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor:
                selectedPeriod === period ? "#232323" : "rgba(35, 35, 35, 0.1)",
              color: selectedPeriod === period ? "#ffffff" : "#232323",
            }}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="space-y-2">
        {/* Y-axis labels */}
        <div
          className="flex justify-between text-xs text-[#888] mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span>$0K</span>
          <span>$10K</span>
          <span>$20K</span>
          <span>$30K</span>
        </div>

        {/* Chart Container */}
        <div className="relative h-24 mb-2">
          {/* Bars */}
          <div className="flex items-end justify-between gap-1 h-full">
            {monthlyData.map((data) => (
              <div
                key={data.month}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Income bar */}
                <div
                  className="w-full rounded-t-sm mb-1 transition-all duration-300"
                  style={{
                    height: `${(data.income / maxValue) * 100}%`,
                    minHeight: "4px",
                    backgroundColor: "#7bc2e8", // theme blue
                  }}
                />
                {/* Expenses - using circular/dot shape */}
                <div
                  className="w-full flex justify-center items-end"
                  style={{
                    height: `${(data.expenses / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(6, Math.min(16, (data.expenses / maxValue) * 24))}px`,
                      height: `${Math.max(6, Math.min(16, (data.expenses / maxValue) * 24))}px`,
                      backgroundColor: "#ea4300", // theme red
                    }}
                  />
                </div>
                {/* Month label */}
                <div
                  className="text-xs text-[#888] mt-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: "#7bc2e8" }}
            ></div>
            <span
              className="text-[#888]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Income
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ea4300" }}
            ></div>
            <span
              className="text-[#888]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Expenses
            </span>
          </div>
        </div>
      </div>

      {/* Click indicator */}
      <div
        className="absolute top-4 right-4 text-[#888] text-xs opacity-70"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Click to change
      </div>
    </div>
  );
}
