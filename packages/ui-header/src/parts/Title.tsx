import React from "react";

export type TitleProps = {
  text: string;
  fontSize: string;
  className?: string;
};

export default function Title({ text, fontSize, className }: TitleProps) {
  return (
    <h1
      className={`primary-text${className ? ` ${className}` : ""}`}
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 900,
        letterSpacing: "0.01em",
        fontSize,
      }}
    >
      {text}
    </h1>
  );
}
