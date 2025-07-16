"use client";

import { HTMLAttributes } from "react";

export default function MusicWidget(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rounded-2xl bg-white shadow-lg p-6" {...props}>
      <span className="text-xl font-bold text-gray-900">Music Widget</span>
      {/* Add your music widget content here, using Tailwind CSS classes */}
      <button className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition">
        Play
      </button>
    </div>
  );
}
