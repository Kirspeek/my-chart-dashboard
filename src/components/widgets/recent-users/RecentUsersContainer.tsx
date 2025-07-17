"use client";

import React from "react";
import type { UserData } from "../../../../interfaces/dashboard";
import { useRecentUsersLogic, useTheme } from "../../../hooks";

interface RecentUsersContainerProps {
  data: UserData[];
}

export default function RecentUsersContainer({
  data,
}: RecentUsersContainerProps) {
  const { formatDate, getTextColor, getHeaderColor, getStatusColors } =
    useRecentUsersLogic();
  const { colors } = useTheme();

  return (
    <div className="overflow-x-auto flex-1">
      <table className="min-w-full h-full">
        <thead>
          <tr
            className="border-b border-opacity-30"
            style={{ borderColor: colors.borderSecondary }}
          >
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{
                color: getHeaderColor,
                fontFamily: "var(--font-mono), fontWeight: 700",
              }}
            >
              NAME
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{
                color: getHeaderColor,
                fontFamily: "var(--font-mono), fontWeight: 700",
              }}
            >
              EMAIL
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{
                color: getHeaderColor,
                fontFamily: "var(--font-mono), fontWeight: 700",
              }}
            >
              ROLE
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{
                color: getHeaderColor,
                fontFamily: "var(--font-mono), fontWeight: 700",
              }}
            >
              STATUS
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
              style={{
                color: getHeaderColor,
                fontFamily: "var(--font-mono), fontWeight: 700",
              }}
            >
              LAST LOGIN
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors rounded-lg"
              style={{ borderRadius: "8px" }}
            >
              <td
                className="px-4 py-4 whitespace-nowrap text-sm font-medium rounded-l-lg"
                style={{
                  color: getTextColor,
                  fontFamily: "var(--font-mono), fontWeight: 700",
                }}
              >
                {user.name}
              </td>
              <td
                className="px-4 py-4 whitespace-nowrap text-sm"
                style={{
                  color: getTextColor,
                  fontFamily: "var(--font-mono), fontWeight: 700",
                }}
              >
                {user.email}
              </td>
              <td
                className="px-4 py-4 whitespace-nowrap text-sm"
                style={{
                  color: getTextColor,
                  fontFamily: "var(--font-mono), fontWeight: 700",
                }}
              >
                {user.role}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor:
                      user.status === "active"
                        ? `${getStatusColors.active}20`
                        : `${getStatusColors.inactive}20`,
                    color:
                      user.status === "active"
                        ? getStatusColors.active
                        : getStatusColors.inactive,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {user.status}
                </span>
              </td>
              <td
                className="px-4 py-4 whitespace-nowrap text-sm rounded-r-lg"
                style={{
                  color: getTextColor,
                  fontFamily: "var(--font-mono), fontWeight: 700",
                }}
              >
                {formatDate(user.lastLogin)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
