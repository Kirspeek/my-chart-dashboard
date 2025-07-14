"use client";

import { Box, useColorModeValue } from "@chakra-ui/react";
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
  const bg = useColorModeValue("rgba(255,255,255,0.95)", "rgba(30,30,30,0.85)");
  const border = useColorModeValue(
    "rgba(0,0,0,0.03)",
    "rgba(255,255,255,0.08)"
  );
  const shadow = useColorModeValue(
    "0 8px 32px 0 rgba(35,35,35,0.10)",
    "0 8px 32px 0 rgba(0,0,0,0.40)"
  );

  return (
    <Box
      bg={bg}
      borderRadius="2rem"
      boxShadow={shadow}
      border="1px solid"
      borderColor={border}
      p="2rem"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
}
