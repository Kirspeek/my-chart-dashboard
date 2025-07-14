"use client";

import { Box, Text, Button } from "@chakra-ui/react";
import { HTMLAttributes } from "react";

export default function MusicWidget(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Box borderRadius="xl" bg="brand.50" boxShadow="lg" p={6} {...props}>
      <Text fontSize="xl" fontWeight="bold" color="brand.900">
        Music Widget
      </Text>
      {/* Add your music widget content here, using Chakra UI components */}
      <Button mt={4} colorScheme="yellow">
        Play
      </Button>
    </Box>
  );
}
