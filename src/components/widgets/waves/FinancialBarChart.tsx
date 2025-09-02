"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { PayHeader } from "../../common";
import SpendingSection from "../../common/SpendingSection";
import WavesChart from "./WavesChart";
import { ChevronRight, Activity, BarChart3 } from "lucide-react";
import WavesHeaderButtons from "./WavesHeaderButtons";
import SpendingTrend from "../../common/SpendingTrend";
import WavesWidgetSpendingTitle from "./WavesWidgetSpendingTitle";
import WavesSelector from "./WavesSelector";
import { WavesFinancialBarChartProps } from "@/interfaces/widgets";
import {
  buildWavesDataFromChart,
  computeWavesInsights,
} from "@/utils/wavesUtils";

type TimePeriod = "Monthly" | "Annual";

export default function FinancialBarChart({
  data,
  annualData,
  onClick,
  showCardNumber = false,
  cardNumber,
}: WavesFinancialBarChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedWave, setSelectedWave] = useState<number | null>(null);
  const { accent } = useTheme();

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const chartData = useMemo(() => {
    const dataToUse =
      selectedPeriod === "Annual" && annualData ? annualData : data;

    if (dataToUse.length === 0) return [];

    return dataToUse.map((item) => ({
      ...item,
      color: accent[item.color as keyof typeof accent] || accent.blue,
    }));
  }, [data, annualData, selectedPeriod, accent]);

  const wavesChartData = useMemo(
    () => buildWavesDataFromChart(chartData, accent),
    [chartData, accent]
  );

  const totalSpending = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return `$${total.toLocaleString()}`;
  }, [chartData]);

  const insights = useMemo(() => computeWavesInsights(chartData), [chartData]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 h-full flex flex-col"
      onClick={handleCardClick}
    >
      <PayHeader
        isMobile={isMobile}
        leftTitle={showCardNumber ? cardNumber || "**** ****" : "All Cards"}
        leftButtons={
          <WavesHeaderButtons
            showAlerts={showAlerts}
            isRefreshing={isRefreshing}
            onToggleAlerts={() => setShowAlerts(!showAlerts)}
            onRefresh={() => handleRefresh()}
            alertActiveColor={accent.red}
          />
        }
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      <SpendingSection>
        <WavesWidgetSpendingTitle
          title={
            selectedPeriod === "Monthly"
              ? "Monthly Spending"
              : "Annual Spending"
          }
          total={totalSpending}
        />
        <SpendingTrend
          direction={insights.trend as "up" | "down"}
          percentage={insights.trendPercentage}
          className="mb-3"
          label={`from last ${selectedPeriod.toLowerCase()}`}
        />
      </SpendingSection>

      <div
        className="flex-1 flex items-end relative"
        style={{
          marginBottom: "-20px",
          marginLeft: "-20px",
          marginRight: "-20px",
        }}
      >
        <WavesChart
          data={wavesChartData}
          title={`${selectedPeriod} Spending`}
        />

        {wavesChartData.length > 0 && (
          <WavesSelector
            data={
              wavesChartData as Array<{
                id: string;
                color: string;
                path: string;
                scaleY?: number;
              }>
            }
            selectedIndex={selectedWave}
            onToggle={(idx) => setSelectedWave(idx === -1 ? null : idx)}
          />
        )}
      </div>

      {showAlerts && (
        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold primary-text flex items-center">
              <Activity
                className="w-4 h-4 mr-1"
                style={{ color: accent.blue }}
              />
              Spending Alerts
            </span>
            <ChevronRight className="w-4 h-4 secondary-text" />
          </div>

          <div className="space-y-2">
            {insights.alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <alert.icon
                  className="w-3 h-3"
                  style={{
                    color:
                      alert.type === "warning"
                        ? accent.red
                        : alert.type === "success"
                          ? accent.teal
                          : accent.blue,
                  }}
                />
                <span className="secondary-text">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedWave !== null && (
        <div
          className="mt-3 p-3 rounded-lg"
          style={{
            background: "var(--button-bg)",
            border: "1px solid var(--button-border)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold primary-text flex items-center">
              <BarChart3
                className="w-4 h-4 mr-1"
                style={{ color: accent.teal }}
              />
              Wave {selectedWave + 1} Analysis
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWave(null);
              }}
              className="text-xs secondary-text hover:primary-text"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="secondary-text">Peak Value</span>
              <span className="font-medium primary-text">
                $
                {Math.round(
                  insights.total * (0.3 + selectedWave * 0.2)
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="secondary-text">Trend</span>
              <span
                className="font-medium primary-text"
                style={{ color: accent.teal }}
              >
                {selectedWave === 0
                  ? "Rising"
                  : selectedWave === 1
                    ? "Stable"
                    : "Declining"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${60 + selectedWave * 15}%`,
                  backgroundColor: accent.teal,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
