"use client";

import AppShell from "@/components/common/AppShell";
import { MusicWidget } from "@/components/widgets";

export default function MusicPage() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <div>
          <MusicWidget title="Now Playing" />
        </div>
        <div />
      </div>
    </AppShell>
  );
}
