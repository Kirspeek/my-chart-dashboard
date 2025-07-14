import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface DataTableProps {
  data: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    lastLogin: string;
  }>;
  title: string;
}
