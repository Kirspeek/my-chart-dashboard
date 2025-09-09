import React from "react";
import { useTheme } from "../../hooks/useTheme";
import type { ButtonProps } from "@/interfaces/button";

export default function Button({
  onClick,
  className = "",
  style = {},
  children,
  title,
}: ButtonProps) {
  const { isDark, colors } = useTheme();

  const baseBg = colors.cardBackground;
  const hoverBg = isDark ? "rgba(255,255,255,0.14)" : "rgba(35,35,35,0.10)";
  const activeBg = isDark ? "rgba(255,255,255,0.2)" : "rgba(35,35,35,0.14)";
  const textColor = colors.primary;

  const animatedGradient = isDark
    ? "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.10), transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
    : "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.45), transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.28), rgba(35,35,35,0.04))";

  const defaultStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 36,
    height: 36,
    padding: "0 10px",
    border: "0",
    backgroundImage: animatedGradient,
    backgroundColor: baseBg,
    backgroundSize: "200% 200%",
    color: textColor,
    borderRadius: 10,
    boxShadow:
      "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
    backdropFilter: "blur(2px)",
    cursor: "pointer",
    transition:
      "background 0.6s ease, background-position 0.6s ease, transform 0.12s ease, box-shadow 0.2s ease",
    animation: "uiButtonBg 8s ease-in-out infinite",
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = hoverBg;
    e.currentTarget.style.boxShadow =
      "0 10px 18px rgba(0,0,0,0.08), 0 3px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)";
    e.currentTarget.style.transform = "translateY(-1px)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = baseBg;
    e.currentTarget.style.boxShadow =
      "0 8px 14px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)";
    e.currentTarget.style.transform = "translateY(0)";
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = activeBg;
    e.currentTarget.style.transform = "translateY(0)";
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = hoverBg;
  };

  return (
    <>
      <button
        className={`ui-button ${className}`}
        style={defaultStyle}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        title={title}
        aria-label={title}
      >
        {children}
      </button>
      <style>{`
        @keyframes uiButtonBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
