"use client";

import AppShell from "@/components/common/AppShell";
import { WidgetHeightProvider } from "@/context/WidgetHeightContext";
import { WidgetStateProvider } from "@/context/WidgetStateContext";
import {
  WalletWidget,
  AggregatedSpendingWidget,
  WheelWidget,
  EnhancedTimelineWidget,
} from "@/components/widgets";

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
