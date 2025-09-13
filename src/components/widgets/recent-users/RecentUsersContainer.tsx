"use client";

import React from "react";
import type { RecentUsersContainerProps } from "@/interfaces/widgets";
import { useRecentUsersLogic } from "@/hooks/useRecentUsersLogic";
import { useTheme } from "@/hooks/useTheme";
import { User, Mail, Shield, Clock } from "lucide-react";

export default function RecentUsersContainer({
  data,
}: RecentUsersContainerProps) {
  const { formatDate, getTextColor } = useRecentUsersLogic();
  const { colorsTheme } = useTheme();
  const recentUsersColors = colorsTheme.widgets.recentUsers;

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
    <div className="flex flex-col flex-1 min-h-0 relative group">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-2 left-2 w-1 h-1 rounded-full"
          style={{ backgroundColor: recentUsersColors.background.pattern }}
        ></div>
        <div
          className="absolute top-6 right-4 w-0.5 h-0.5 rounded-full"
          style={{ backgroundColor: recentUsersColors.background.pattern }}
        ></div>
        <div
          className="absolute bottom-4 left-6 w-0.5 h-0.5 rounded-full"
          style={{ backgroundColor: recentUsersColors.background.pattern }}
        ></div>
      </div>
      <div className="flex-1 min-h-0  h-full overflow-y-auto overflow-x-auto scrollbar-hide">
        <table className="min-w-full relative h-full z-10">
          <thead>
            <tr
              className="border-b border-opacity-30 sticky top-0"
              style={{ borderColor: colorsTheme.borderSecondary }}
            >
              <th
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: recentUsersColors.table.headerText,
                }}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>NAME</span>
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: recentUsersColors.table.headerText,
                }}
              >
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>EMAIL</span>
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: recentUsersColors.table.headerText,
                }}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>ROLE</span>
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: recentUsersColors.table.headerText,
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                  <span>STATUS</span>
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: recentUsersColors.table.headerText,
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
                className="transition-all duration-300 rounded-lg group/row"
                style={{
                  borderRadius: "8px",
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    recentUsersColors.table.rowHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm font-medium rounded-l-lg group-hover/row:scale-105 transition-transform duration-300"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: recentUsersColors.text.primary,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full opacity-60"
                      style={{
                        backgroundColor: recentUsersColors.table.accentDot,
                      }}
                    ></div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: recentUsersColors.text.secondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = recentUsersColors.text.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      recentUsersColors.text.secondary;
                  }}
                >
                  {user.email}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm"
                  style={{
                    color: getTextColor,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="opacity-70"
                      style={{ color: recentUsersColors.table.roleIcon }}
                    >
                      {getRoleIcon(user.role)}
                    </div>
                    <span style={{ color: recentUsersColors.text.secondary }}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30"
                      style={{
                        backgroundColor:
                          user.status === "active"
                            ? "rgba(34, 197, 94, 0.6)"
                            : "rgba(239, 68, 68, 0.6)",
                        boxShadow:
                          user.status === "active"
                            ? "0 1px 3px rgba(34, 197, 94, 0.2)"
                            : "0 1px 3px rgba(239, 68, 68, 0.2)",
                      }}
                    ></div>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-md transition-all duration-200 bg-emerald-50 text-emerald-700"
                      style={{
                        backgroundColor:
                          user.status === "active"
                            ? "rgba(34, 197, 94, 0.08)"
                            : "rgba(239, 68, 68, 0.08)",
                        color:
                          user.status === "active"
                            ? "rgba(34, 197, 94, 0.8)"
                            : "rgba(239, 68, 68, 0.8)",
                        border:
                          user.status === "active"
                            ? "1px solid rgba(34, 197, 94, 0.15)"
                            : "1px solid rgba(239, 68, 68, 0.15)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {user.status}
                    </span>
                  </div>
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-sm rounded-r-lg transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: recentUsersColors.text.secondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = recentUsersColors.text.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      recentUsersColors.text.secondary;
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Clock
                      className="w-3 h-3 opacity-60"
                      style={{ color: recentUsersColors.table.clockIcon }}
                    />
                    <span>{formatDate(user.lastLogin)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--button-border)] opacity-60 w-full">
        <div className="flex justify-between items-center text-xs secondary-text">
          <span>Total Users: {data.length}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.6)",
                  boxShadow: "0 1px 3px rgba(34, 197, 94, 0.2)",
                }}
              ></div>
              <span>
                Active: {data.filter((user) => user.status === "active").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.6)",
                  boxShadow: "0 1px 3px rgba(239, 68, 68, 0.2)",
                }}
              ></div>
              <span>
                Inactive:{" "}
                {data.filter((user) => user.status === "inactive").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
