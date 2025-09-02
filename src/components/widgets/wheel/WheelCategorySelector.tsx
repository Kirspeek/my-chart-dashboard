import React from "react";
import { ExpenseData } from "@/interfaces/widgets";
import { useTheme } from "../../../hooks/useTheme";

interface WheelCategorySelectorProps {
  data: ExpenseData[];
  selected: string | null;
  onToggle: (name: string) => void;
  className?: string;
}

export default function WheelCategorySelector({
  data,
  selected,
  onToggle,
  className = "absolute bottom-8 left-2 flex flex-col space-y-1",
}: WheelCategorySelectorProps) {
  const { accent } = useTheme();

  return (
    <div className={className}>
      {data.map((category) => (
        <button
          key={category.name}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(category.name);
          }}
          className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
            selected === category.name ? "ring-2 ring-white" : ""
          }`}
          style={{
            backgroundColor:
              accent[category.color as keyof typeof accent] || accent.blue,
          }}
          title={`${category.name} ${category.percentage}%`}
        />
      ))}
    </div>
  );
}
