"use client";

import {
  ChakraProvider as ChakraUIProvider,
  ColorModeScript,
} from "@chakra-ui/react";
import { theme } from "@/lib/chakra-theme";
import { ReactNode } from "react";

interface ChakraProviderProps {
  children: ReactNode;
}

export default function ChakraProvider({ children }: ChakraProviderProps) {
  return (
    <ChakraUIProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraUIProvider>
  );
}
