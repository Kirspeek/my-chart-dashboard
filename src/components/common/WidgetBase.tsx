"use client";

import { ReactNode, HTMLAttributes } from "react";

interface WidgetBaseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function WidgetBase({
  children,
  className = "",
  style = {},
  ...props
}: WidgetBaseProps) {
  // Modern glassy, alive effect
  const bg = "rgba(var(--background-rgb), 0.65)";
  const border = "rgba(0,0,0,0.06)";
  // Stronger, more 3D shadow
  const shadow =
    "0 8px 32px 0 rgba(35,35,35,0.18), 0 2px 8px 0 rgba(255,255,255,0.10) inset, 0 1.5px 8px 0 rgba(234,67,0,0.04)";

  return (
    <div
      className={`rounded-[2.5rem] border p-8 ${className}`}
      style={{
        background: bg,
        borderColor: border,
        boxShadow: shadow,
        borderWidth: 2,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
