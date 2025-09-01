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
import { StatusBadge, Divider } from "../../common";

interface RecentUsersContainerProps {
  data: UserData[];
}

export default function RecentUsersContainer({
  data,
}: RecentUsersContainerProps) {
  const { formatDate, getTextColor } = useRecentUsersLogic();
  const { colorsTheme } = useTheme();
  const recentUsersColors = colorsTheme.widgets.recentUsers;

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
    <div className="overflow-x-auto flex-1 relative group scrollbar-hide">
      {/* Background pattern */}
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

      <table className="min-w-full h-full relative z-10">
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
                <TrendingUp className="w-3 h-3" />
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
                e.currentTarget.style.backgroundColor = recentUsersColors.table.rowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
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
                    style={{ backgroundColor: recentUsersColors.table.accentDot }}
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
                  e.currentTarget.style.color = recentUsersColors.text.secondary;
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
                  <span style={{ color: recentUsersColors.text.secondary }}>{user.role}</span>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <StatusBadge
                  variant={user.status === "active" ? "success" : "default"}
                  size="md"
                  className="font-mono font-bold"
                >
                  {getStatusIcon(user.status)}
                  <span>{user.status}</span>
                </StatusBadge>
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
                  e.currentTarget.style.color = recentUsersColors.text.secondary;
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

      <Divider className="mt-4" />
      <div 
        className="flex justify-between items-center text-xs"
        style={{ color: recentUsersColors.text.secondary }}
      >
        <span>Total Users: {data.length}</span>
        <span>
          Active: {data.filter((user) => user.status === "active").length}
        </span>
        <span>
          Inactive: {data.filter((user) => user.status === "inactive").length}
        </span>
      </div>
    </div>
  );
}
