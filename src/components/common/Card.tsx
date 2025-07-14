import { Box } from "@chakra-ui/react";
import { CommonComponentProps } from "../../../interfaces/common";

export default function Card({
  children,
  className = "",
  style = {},
  ...props
}: CommonComponentProps) {
  return (
    <Box
      borderRadius="xl"
      bg="brand.50"
      boxShadow="lg"
      p={8}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Box>
  );
}
