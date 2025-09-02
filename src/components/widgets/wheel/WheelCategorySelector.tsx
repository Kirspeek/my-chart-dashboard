import React from "react";
import { WheelCategorySelectorProps } from "@/interfaces/widgets";
import { useTheme } from "../../../hooks/useTheme";

export default function WheelCategorySelector({
  data,
  selected,
  onToggle,
  className,
  offsetTop,
}: WheelCategorySelectorProps & { offsetTop?: number }) {
  const { accent } = useTheme();

  return (
    <div
      className={
        className ||
        `absolute ${typeof offsetTop === "number" ? "" : "top-2"} left-2 flex flex-col space-y-1`
      }
      style={
        typeof offsetTop === "number"
          ? { top: offsetTop, left: 8, position: "absolute" }
          : undefined
      }
    >
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
