import React from "react";

export default function WavesWidgetSpendingTitle({
  title,
  total,
}: {
  title: string;
  total: string;
}) {
  return (
    <>
      <div className="text-sm secondary-text mb-1">{title}</div>
      <div className="text-2xl font-bold primary-text font-mono mb-2">
        {total}
      </div>
    </>
  );
}
