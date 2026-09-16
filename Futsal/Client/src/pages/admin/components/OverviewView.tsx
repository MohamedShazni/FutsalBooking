import React from "react";
import {
  DollarSign,
  CalendarCheck,
  Layers,
  TrendingUp,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { AdminStats, Booking, Court } from "../types";

interface OverviewViewProps {
  stats: AdminStats | null;
  bookings: Booking[];
  courts: Court[];
  onOpenManualBooking: () => void;
  onOpenAddCourt: () => void;
  onSelectTab: (tab: string) => void;
  onUpdateBookingStatus: (
    bookingId: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED",
    paymentStatus?: "Paid" | "Pending" | "Pay at Venue",
  ) => Promise<void>;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  bookings,
  courts,
  onOpenManualBooking,
  onOpenAddCourt,
  onSelectTab,
}) => {
  const summary = stats?.summary || {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
    cancelledBookings: bookings.filter((b) => b.status === "CANCELLED").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    totalRevenue: bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + (b.price || 0), 0),
    paidRevenue: bookings
      .filter((b) => b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + (b.price || 0), 0),
    pendingRevenue: 0,
    todayBookingsCount: 0,
    todayRevenue: 0,
    totalCourts: courts.length,
    activeCourts: courts.filter((c) => c.status === "Active").length,
    maintenanceCourts: courts.filter((c) => c.status === "Maintenance").length,
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const activeCourtsCount = courts.filter((c) => c.status === "Active").length;
  const recentBookings = bookings.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* ================= KPI STATS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#112233] border border-[#1f384d] hover:border-[#00f0ff]/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Revenue
            </span>
            <div className="p-2.5 bg-[#00f0ff]/10 text-[#00f0ff] rounded-xl border border-[#00f0ff]/20 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white">
              Rs. {summary.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Rs. {summary.paidRevenue.toLocaleString()} collected</span>
            </p>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-[#112233] border border-[#1f384d] hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Reservations
            </span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-400">
              {summary.totalBookings}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {summary.confirmedBookings} active • {summary.completedBookings}{" "}
              completed
            </p>
          </div>
        </div>

        {/* Active Courts */}
        <div className="bg-[#112233] border border-[#1f384d] hover:border-[#00f0ff]/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Active Courts
            </span>
            <div className="p-2.5 bg-[#00f0ff]/10 text-[#00f0ff] rounded-xl border border-[#00f0ff]/20 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white">
              {activeCourtsCount}{" "}
              <span className="text-sm font-normal text-gray-400">
                / {courts.length}
              </span>
            </h3>
            <p className="text-xs text-[#00f0ff] mt-1">
              {summary.maintenanceCourts > 0
                ? `${summary.maintenanceCourts} under maintenance`
                : "100% arenas operational"}
            </p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-[#112233] border border-[#1f384d] hover:border-amber-400/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Today's Matches
            </span>
            <div className="p-2.5 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-amber-400">
              {todayBookings.length}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Scheduled for today</p>
          </div>
        </div>
      </div>

      {/* ================= QUICK ACTIONS & SHORTCUT BANNER ================= */}
      <div className="bg-gradient-to-r from-[#112233] via-[#162c3e] to-[#0c1a25] border border-[#1f384d] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">
              Court Management Hub
            </h4>
            <p className="text-xs text-gray-400">
              Manage court surfaces, night rates, player bookings, or launch
              walk-ins.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenManualBooking}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-[#00f0ff] hover:bg-white text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#00f0ff]/20"
          >
            <Plus className="w-4 h-4" /> Book Walk-in Slot
          </button>
          <button
            onClick={onOpenAddCourt}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] border border-[#1f384d] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Court
          </button>
        </div>
      </div>

      {/* ================= TWO COLUMN SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Bookings Feed */}
        <div className="lg:col-span-2 bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f384d]">
            <div>
              <h3 className="font-bold text-lg text-white">
                Recent Reservations
              </h3>
              <p className="text-xs text-gray-400">
                Latest online and manual bookings
              </p>
            </div>
            <button
              onClick={() => onSelectTab("bookings")}
              className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1 font-semibold"
            >
              View All Bookings <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">
                No recent bookings available.
              </p>
            ) : (
              recentBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="p-4 rounded-xl bg-[#0c1a25] border border-[#1f384d] hover:border-[#00f0ff]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#162c3e] border border-[#1f384d] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                      {b.courtName.slice(-1) || "C"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {b.customerName}
                        </span>
                        <span className="font-mono text-[11px] text-[#00f0ff]">
                          {b.bookingId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{b.courtName}</span>
                        <span>•</span>
                        <span>{b.date}</span>
                        <span>•</span>
                        <span>{b.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1f384d]">
                    <span className="font-bold text-white text-sm">
                      Rs. {b.price}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : b.status === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Courts Status & Overview */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1f384d]">
              <div>
                <h3 className="font-bold text-lg text-white">Courts Status</h3>
                <p className="text-xs text-gray-400">
                  Live operational overview
                </p>
              </div>
              <button
                onClick={() => onSelectTab("courts")}
                className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1 font-semibold"
              >
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {courts.map((court) => (
                <div
                  key={court.courtId}
                  className="p-3.5 rounded-xl bg-[#0c1a25] border border-[#1f384d] flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-white text-sm">
                      {court.name}
                    </h5>
                    <p className="text-[11px] text-gray-400">{court.surface}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        court.status === "Active"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : court.status === "Maintenance"
                            ? "text-amber-400 bg-amber-400/10"
                            : "text-rose-400 bg-rose-400/10"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          court.status === "Active"
                            ? "bg-emerald-400"
                            : court.status === "Maintenance"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                        }`}
                      />
                      {court.status}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Rs. {court.basePrice} / {court.peakPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1f384d] text-center">
            <button
              onClick={() => onSelectTab("matrix")}
              className="w-full py-2.5 bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] rounded-xl text-xs font-bold transition-colors border border-[#1f384d]"
            >
              Open Daily Visual Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
