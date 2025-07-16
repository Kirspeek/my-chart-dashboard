import { CommonComponentProps } from "../../../interfaces/common";

export default function Card({
  children,
  className = "",
  style = {},
  ...props
}: CommonComponentProps) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-lg p-8 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
