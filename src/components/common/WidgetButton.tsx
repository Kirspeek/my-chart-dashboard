"use client";
import { Button, useColorModeValue, ButtonProps } from "@chakra-ui/react";

export default function WidgetButton(props: ButtonProps) {
  const bg = useColorModeValue("rgba(35,35,35,0.12)", "rgba(255,255,255,0.10)");
  const color = useColorModeValue("#232323", "#fff");
  return (
    <Button
      bg={bg}
      color={color}
      borderRadius="2rem"
      _hover={{
        bg: useColorModeValue("rgba(35,35,35,0.18)", "rgba(255,255,255,0.18)"),
      }}
      _active={{
        bg: useColorModeValue("rgba(35,35,35,0.22)", "rgba(255,255,255,0.22)"),
      }}
      fontWeight={700}
      {...props}
    />
  );
}
