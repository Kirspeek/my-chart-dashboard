"use client";

import AppShell from "@/components/common/AppShell";
import { BubbleChartWidget } from "@/components/widgets";
import { useEffect, useState } from "react";

export default function ModelsPage() {
  const [bubbleData, setBubbleData] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      category: string;
      label: string;
    }>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await import("@/data/json/bubbleData.json").then(
          (m) => m.default
        );
        setBubbleData(data);
      } catch {}
    })();
  }, []);

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-8 my-8">
        <BubbleChartWidget
          data={bubbleData}
          title="Global Tech Investment"
          subtitle="Market Cap vs Growth vs Workforce Size"
        />
      </div>
    </AppShell>
  );
}
