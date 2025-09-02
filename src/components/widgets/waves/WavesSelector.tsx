import React from "react";
import { WavesChartProps } from "@/interfaces/widgets";

export default function WavesSelector({
  data,
  selectedIndex,
  onToggle,
  className = "absolute top-2 left-2 flex flex-col space-y-1",
}: {
  data: NonNullable<WavesChartProps["data"]>;
  selectedIndex: number | null;
  onToggle: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {data.map((wave, index) => (
        <button
          key={wave.id}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(selectedIndex === index ? -1 : index);
          }}
          className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
            selectedIndex === index ? "ring-2 ring-white" : ""
          }`}
          style={{ backgroundColor: wave.color }}
          title={`Wave ${index + 1}`}
        />
      ))}
    </div>
  );
}
