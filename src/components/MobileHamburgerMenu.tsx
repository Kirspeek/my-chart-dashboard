"use client";

import React from "react";
import { Menu } from "lucide-react";

interface MobileHamburgerMenuProps {
  onOpenSidebar: () => void;
}

export default function MobileHamburgerMenu({
  onOpenSidebar,
}: MobileHamburgerMenuProps) {
  return (
    <button
      className="fixed top-8 left-4 z-40 p-3 rounded-md text-secondary hover:text-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary"
      onClick={onOpenSidebar}
      aria-label="Open sidebar"
      type="button"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
