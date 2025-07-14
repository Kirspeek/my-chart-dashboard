"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { BarChartProps } from "@/interfaces";

export default function BarChart({ data, title }: BarChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
          <Legend />
          <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
