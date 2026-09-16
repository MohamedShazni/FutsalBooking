import React from "react";
import { BarChart3, TrendingUp, Layers, Award, Clock } from "lucide-react";
import { AdminStats, Booking, Court } from "../types";

interface AnalyticsViewProps {
  stats: AdminStats | null;
  bookings: Booking[];
  courts: Court[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  stats,
  bookings,
  courts,
}) => {
  const totalRevenue = stats?.summary.totalRevenue || 0;
  const confirmedBookings = stats?.summary.confirmedBookings || 0;
  const totalBookings = bookings.length;

  // Calculate court revenue breakdown
  const courtBreakdown = courts.map((court) => {
    const courtBookings = bookings.filter(
      (b) => b.courtId === court.courtId && b.status !== "CANCELLED",
    );
    const revenue = courtBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const share =
      totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
    return {
      courtId: court.courtId,
      name: court.name,
      bookingsCount: courtBookings.length,
      revenue,
      share,
    };
  });

  // Calculate peak vs non-peak breakdown
  let peakRevenue = 0;
  let regularRevenue = 0;

  bookings.forEach((b) => {
    if (b.status === "CANCELLED") return;
    const hourPart = parseInt(b.time.trim().split(" ")[0]);
    const isPM = b.time.includes("PM");
    const isPeak = isPM && hourPart >= 6 && hourPart !== 12;
    if (isPeak) peakRevenue += b.price || 0;
    else regularRevenue += b.price || 0;
  });

  const peakShare =
    totalRevenue > 0 ? Math.round((peakRevenue / totalRevenue) * 100) : 50;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff] border border-[#00f0ff]/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Performance Analytics & Revenue Metrics
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Comprehensive court utilization, peak slot demand, and financial
              insights.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Total Gross Revenue
          </p>
          <h3 className="text-2xl font-extrabold text-[#00f0ff] mt-2">
            Rs. {totalRevenue.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Lifetime bookings
          </p>
        </div>

        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Average Match Value
          </p>
          <h3 className="text-2xl font-extrabold text-white mt-2">
            Rs.{" "}
            {confirmedBookings > 0
              ? Math.round(totalRevenue / confirmedBookings)
              : 2500}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Per 60-minute session</p>
        </div>

        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Peak Evening Share
          </p>
          <h3 className="text-2xl font-extrabold text-white mt-2">
            {peakShare}%
          </h3>
          <p className="text-xs text-[#00f0ff] mt-1">
            Night slots (06 PM - 11 PM)
          </p>
        </div>

        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Booking Completion
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">
            {totalBookings > 0
              ? Math.round((confirmedBookings / totalBookings) * 100)
              : 100}
            %
          </h3>
          <p className="text-xs text-gray-400 mt-1">Low cancellation rate</p>
        </div>
      </div>

      {/* Court Distribution Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Court */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-5">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00f0ff]" /> Court Revenue
            Breakdown
          </h4>

          <div className="space-y-4">
            {courtBreakdown.map((court) => (
              <div key={court.courtId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{court.name}</span>
                  <span className="text-[#00f0ff] font-bold">
                    Rs. {court.revenue.toLocaleString()} ({court.share}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-[#0c1a25] rounded-full overflow-hidden border border-[#1f384d]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00f0ff] to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${court.share || 10}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-500 flex justify-between">
                  <span>{court.bookingsCount} reservations</span>
                  <span>Court #{court.courtId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak vs Off-Peak Revenue Visual */}
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00f0ff]" /> Time Window Revenue
              Distribution
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              Comparison between daytime standard hours and evening peak hours.
            </p>
          </div>

          <div className="space-y-5 my-auto">
            <div className="p-4 rounded-xl bg-[#0c1a25] border border-[#1f384d] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">
                  Night Peak Revenue (06 PM - 11 PM)
                </span>
                <span className="text-xl font-bold text-[#00f0ff]">
                  Rs. {peakRevenue.toLocaleString()}
                </span>
              </div>
              <span className="text-sm font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20">
                {peakShare}% of total
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0c1a25] border border-[#1f384d] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">
                  Day Standard Revenue (09 AM - 05 PM)
                </span>
                <span className="text-xl font-bold text-white">
                  Rs. {regularRevenue.toLocaleString()}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-300 bg-[#162c3e] px-3 py-1 rounded-full border border-[#1f384d]">
                {100 - peakShare}% of total
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-400 bg-[#0c1a25] p-3 rounded-xl border border-[#1f384d] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00f0ff] shrink-0" />
            <span>
              Peak evening slots (07:00 PM - 10:00 PM) generate the highest
              utilization rate.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
