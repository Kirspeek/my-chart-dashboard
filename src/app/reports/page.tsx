"use client";

import AppShell from "@/components/common/AppShell";
import dynamic from "next/dynamic";
import { WidgetHeightProvider } from "@/context/WidgetHeightContext";
import { WidgetStateProvider } from "@/context/WidgetStateContext";
const WalletWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.WalletWidget),
  { ssr: false }
);
const AggregatedSpendingWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.AggregatedSpendingWidget),
  { ssr: false }
);
const WheelWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.WheelWidget),
  { ssr: false }
);
const EnhancedTimelineWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.EnhancedTimelineWidget),
  { ssr: false }
);

export default function ReportsPage() {
  return (
    <AppShell>
      <WidgetHeightProvider>
        <WidgetStateProvider>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 my-8 items-stretch md:justify-items-center lg:justify-items-stretch">
            <div className="md:w-full lg:col-span-2 xl:col-span-1">
              <WalletWidget />
            </div>
            <div className="md:w-full">
              <WheelWidget />
            </div>
            <div className="md:w-full">
              <AggregatedSpendingWidget />
            </div>
          </div>
        </WidgetStateProvider>
      </WidgetHeightProvider>
      <div className="grid grid-cols-1 gap-8 my-8">
        <EnhancedTimelineWidget />
      </div>
    </AppShell>
  );
}
