import React, { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  CalendarCheck2,
  Grid3X3,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Bell,
  Plus,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from "./types";

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenManualBooking: () => void;
  onOpenAddCourt: () => void;
  isConnected: boolean;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onMarkNotificationRead: (id: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onOpenManualBooking,
  onOpenAddCourt,
  isConnected,
  notifications,
  onClearNotifications,
  onMarkNotificationRead,
  children,
}) => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courts", label: "Courts Management", icon: Layers },
    { id: "bookings", label: "Bookings", icon: CalendarCheck2 },
    { id: "matrix", label: "Schedule Matrix", icon: Grid3X3 },
    { id: "pricing", label: "Slots & Pricing", icon: DollarSign },
    { id: "customers", label: "Player Directory", icon: Users },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "settings", label: "Center Settings", icon: Settings },
  ];

  const getPageTitle = () => {
    const item = navItems.find((n) => n.id === currentTab);
    return item ? item.label : "Admin Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0c1a25] text-white flex flex-col md:flex-row antialiased">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed md:sticky top-0 h-screen bg-[#112233] border-r border-[#1f384d] z-50 flex flex-col justify-between transition-all duration-300 ${
          isSidebarCollapsed ? "md:w-20" : "md:w-64"
        } ${
          isMobileMenuOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#1f384d] flex items-center justify-between">
          <div
            onClick={() => {
              onTabChange("overview");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-blue-600 flex items-center justify-center font-extrabold text-black text-xl shadow-lg shadow-[#00f0ff]/20">
              S7
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-extrabold text-lg leading-tight tracking-wide text-white">
                  <span className="text-[#00f0ff]">S7</span> FUTSAL
                </h1>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Admin Console
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-gray-400 hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                  isActive
                    ? "bg-[#00f0ff] text-black shadow-lg shadow-[#00f0ff]/20"
                    : "text-gray-400 hover:text-white hover:bg-[#162c3e]"
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    isActive
                      ? "text-black"
                      : "text-[#00f0ff] group-hover:scale-110"
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {isActive && !isSidebarCollapsed && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-black/60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[#1f384d] space-y-2 bg-[#0c1a25]/60">
          {/* Public Site Link */}
          <button
            onClick={() => navigate("/")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#162c3e] border border-[#1f384d] transition-colors ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
            title="Go to Public Booking Site"
          >
            <ExternalLink className="w-4 h-4 text-[#00f0ff] shrink-0" />
            {!isSidebarCollapsed && <span>Public Booking Site</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-[#162c3e] rounded-xl transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* ================= NAVBAR ================= */}
        <header className="sticky top-0 z-30 bg-[#112233]/95 backdrop-blur-md border-b border-[#1f384d] px-4 md:px-8 py-4 flex items-center justify-between gap-6">
          {/* Left: Mobile menu button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-300 hover:text-white hover:bg-[#162c3e] rounded-xl md:hidden border border-[#1f384d]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Console</span>
                <span>/</span>
                <span className="text-[#00f0ff] font-medium">
                  {getPageTitle()}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white hidden sm:block">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right: Actions, Live Indicator, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* Live Socket Status Pill */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                }`}
              />
              <span>
                {isConnected ? "Real-time Live Sync" : "Connecting..."}
              </span>
            </div>

            {/* Quick Action: + Walk-in Booking */}
            <button
              onClick={onOpenManualBooking}
              className="bg-[#00f0ff] hover:bg-white text-black font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:shadow-[#00f0ff]/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Booking</span>
            </button>

            {/* Quick Action: + Add Court */}
            <button
              onClick={onOpenAddCourt}
              className="bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] border border-[#1f384d] font-bold px-3.5 py-2 rounded-xl text-xs hidden md:flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Court</span>
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 bg-[#0c1a25] hover:bg-[#162c3e] border border-[#1f384d] text-gray-300 hover:text-white rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00f0ff] text-black font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#112233] border border-[#1f384d] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="p-4 border-b border-[#1f384d] bg-[#0c1a25] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#00f0ff]" />
                      <h4 className="font-bold text-sm text-white">
                        Live Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f0ff]/20 text-[#00f0ff]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#1f384d]/60 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        No recent alerts. New online bookings will alert in
                        real-time.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className={`p-3.5 hover:bg-[#162c3e] transition-colors cursor-pointer flex items-start gap-3 ${
                            !notif.read ? "bg-[#00f0ff]/5" : ""
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !notif.read ? "bg-[#00f0ff]" : "bg-gray-600"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-300 mt-0.5">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-gray-500 mt-1 block">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#1f384d]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-blue-600 flex items-center justify-center font-bold text-black text-xs shadow-md">
                AD
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  Manager
                </span>
                <span className="text-[10px] text-[#00f0ff] block">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* ================= PAGE VIEW BODY ================= */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
