"use client";

import React from "react";
import type { UserData } from "../../../../interfaces/dashboard";
import { useRecentUsersLogic, useTheme } from "../../../hooks";
import {
  User,
  Mail,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface RecentUsersContainerProps {
  data: UserData[];
}

export default function RecentUsersContainer({
  data,
}: RecentUsersContainerProps) {
  const { formatDate, getTextColor, getStatusColors } = useRecentUsersLogic();
  const { colors } = useTheme();

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "manager":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="overflow-x-auto flex-1 relative group">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-2 left-2 w-1 h-1 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute top-6 right-4 w-0.5 h-0.5 bg-[var(--accent-color)] rounded-full"></div>
        <div className="absolute bottom-4 left-6 w-0.5 h-0.5 bg-[var(--accent-color)] rounded-full"></div>
      </div>

      <table className="min-w-full h-full relative z-10">
        <thead>
          <tr
            className="border-b border-opacity-30 sticky top-0"
            style={{ borderColor: colors.borderSecondary }}
          >
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider primary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>NAME</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider primary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3" />
                <span>EMAIL</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider primary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>ROLE</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider primary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3" />
                <span>STATUS</span>
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider primary-text"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
              }}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>LAST LOGIN</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr
              key={user.id}
              className="hover:bg-[var(--button-hover-bg)] transition-all duration-300 rounded-lg group/row"
              style={{
                borderRadius: "8px",
                animationDelay: `${index * 100}ms`,
              }}
            >
              <td
                className="px-4 py-4 whitespace-nowrap text-sm font-medium rounded-l-lg primary-text group-hover/row:scale-105 transition-transform duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full opacity-60"></div>
                  <span>{user.name}</span>
                </div>
              </td>
              <td
                className="px-4 py-4 whitespace-nowrap text-sm secondary-text group-hover/row:text-[var(--accent-color)] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                {user.email}
              </td>
              <td
                className="px-4 py-4 whitespace-nowrap text-sm"
                style={{
                  color: getTextColor,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="text-[var(--accent-color)] opacity-70">
                    {getRoleIcon(user.role)}
                  </div>
                  <span className="secondary-text">{user.role}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-105"
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
                  {getStatusIcon(user.status)}
                  <span>{user.status}</span>
                </span>
              </td>
              <td
                className="px-4 py-4 whitespace-nowrap text-sm rounded-r-lg secondary-text group-hover/row:text-[var(--accent-color)] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                }}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 opacity-60" />
                  <span>{formatDate(user.lastLogin)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary footer */}
      <div className="mt-4 pt-4 border-t border-[var(--button-border)] opacity-60">
        <div className="flex justify-between items-center text-xs secondary-text">
          <span>Total Users: {data.length}</span>
          <span>
            Active: {data.filter((user) => user.status === "active").length}
          </span>
          <span>
            Inactive: {data.filter((user) => user.status === "inactive").length}
          </span>
        </div>
      </div>
    </div>
  );
}
