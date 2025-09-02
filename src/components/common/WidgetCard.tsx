import { WidgetCardProps } from "@/interfaces/common";

export default function WidgetCard({
  children,
  variant = "default",
  className = "",
  style = {},
  ...props
}: WidgetCardProps) {
  let padding = "p-6";
  let minW = "",
    minH = "",
    maxW = "";
  if (variant === "compact") {
    padding = "p-4";
  } else if (variant === "large") {
    padding = "p-8";
    minW = "min-w-[600px]";
    minH = "min-h-[480px]";
    maxW = "max-w-[800px]";
  }
  return (
    <div
      className={`rounded-2xl bg-white shadow-lg ${padding} ${minW} ${minH} ${maxW} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
