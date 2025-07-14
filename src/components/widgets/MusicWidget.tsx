"use client";

import Card from "../common/Card";

export default function MusicWidget() {
  return (
    <Card
      className="widget flex flex-col justify-between"
      style={{
        background: "#E6D6FF", // pastel violet
        borderRadius: "2rem",
        boxShadow: "none",
        padding: "2.5rem 2.5rem",
        minWidth: 300,
        minHeight: 200,
        width: "100%",
        height: "100%",
        color: "#232323",
      }}
    >
      <div className="text-lg font-semibold mb-1">Speaker</div>
      <div className="text-sm font-bold">Dance of the Knights</div>
      <div className="text-xs mt-1" style={{ opacity: 0.7 }}>
        Prokofiev
      </div>
      <div className="flex gap-2 mt-2">
        <button className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold">
          ⏮️
        </button>
        <button className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold">
          ⏯️
        </button>
        <button className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold">
          ⏭️
        </button>
      </div>
    </Card>
  );
}
