"use client";

import React from "react";

interface SpendingSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpendingSection({
  children,
  className = "",
}: SpendingSectionProps) {
  return <div className={`text-center mb-4 mt-4 ${className}`}>{children}</div>;
}
