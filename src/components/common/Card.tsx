import React from "react";
import { CardProps } from "../../../interfaces/common";

export default function Card({
  children,
  className = "",
  style = {},
  ...props
}: CardProps) {
  return (
    <div className={`card ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}
