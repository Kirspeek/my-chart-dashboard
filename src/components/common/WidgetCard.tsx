import { Box } from "@chakra-ui/react";
import { WidgetCardProps } from "../../../interfaces/common";

export default function WidgetCard({
  children,
  variant = "default",
  className = "",
  style = {},
  ...props
}: WidgetCardProps) {
  let padding = 6;
  let minW, minH, maxW;
  if (variant === "compact") {
    padding = 4;
  } else if (variant === "large") {
    padding = 8;
    minW = "600px";
    minH = "480px";
    maxW = "800px";
  }
  return (
    <Box
      borderRadius="xl"
      bg="brand.50"
      boxShadow="lg"
      p={padding}
      minW={minW}
      minH={minH}
      maxW={maxW}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Box>
  );
}
