"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/common/AppShell";
import dynamic from "next/dynamic";
const RecentUsersWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.RecentUsersWidget),
  { ssr: false }
);
const DeviceUsageWidget = dynamic(
  () => import("@/components/widgets").then((m) => m.DeviceUsageWidget),
  { ssr: false }
);
import type { UserData } from "@/interfaces/dashboard";

export default function UsersPage() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [pieData, setPieData] = useState<
    Array<{ name: string; value: number; color: string }>
  >([]);

  useEffect(() => {
    async function load() {
      const [users, pie] = await Promise.all([
        import("@/data/json/userData.json").then((m) => m.default),
        import("@/data/json/pieChartData.json").then((m) => m.default),
      ]);
      setUserData(users);
      setPieData(pie);
    }
    load();
  }, []);

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 my-8">
        <div className="lg:col-span-2 xl:col-span-2 h-full">
          <RecentUsersWidget data={userData} title="Recent Users" />
        </div>
        <div className="h-full">
          <DeviceUsageWidget data={pieData} title="Device Usage" />
        </div>
      </div>
    </AppShell>
  );
}
