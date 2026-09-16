import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Booking, Court } from "../types";

interface ScheduleMatrixProps {
  courts: Court[];
  bookings: Booking[];
  onOpenBookingForSlot: (courtId: number, date: string, time: string) => void;
}

const TIME_SLOTS = [
  "09 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  " 2 PM",
  " 3 PM",
  " 4 PM",
  " 5 PM",
  " 6 PM",
  " 7 PM",
  " 8 PM",
  " 9 PM",
  "10 PM",
  "11 PM",
];

export const ScheduleMatrix: React.FC<ScheduleMatrixProps> = ({
  courts,
  bookings,
  onOpenBookingForSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const dayBookings = bookings.filter(
    (b) => b.date === selectedDate && b.status !== "CANCELLED",
  );

  return (
    <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Date Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#1f384d]">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00f0ff]" /> Live Schedule &
            Court Matrix
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Visual court occupation grid. Click any open slot to quickly assign
            a booking.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 bg-[#0c1a25] hover:bg-[#162c3e] border border-[#1f384d] text-gray-300 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:border-[#00f0ff]"
          />

          <button
            onClick={handleNextDay}
            className="p-2 bg-[#0c1a25] hover:bg-[#162c3e] border border-[#1f384d] text-gray-300 rounded-xl transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              setSelectedDate(new Date().toISOString().split("T")[0])
            }
            className="px-3 py-2 bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] border border-[#1f384d] rounded-xl text-xs font-semibold transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
          <span className="text-gray-300">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#00f0ff]/20 border border-[#00f0ff]" />
          <span className="text-gray-300">Confirmed Booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500" />
          <span className="text-gray-300">Completed Match</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
          <span className="text-gray-300">Court Maintenance</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0c1a25] border-b border-[#1f384d]">
              <th className="p-3.5 text-gray-400 font-semibold sticky left-0 bg-[#0c1a25] z-10 min-w-[130px]">
                Time Slot
              </th>
              {courts.map((court) => (
                <th
                  key={court.courtId}
                  className="p-3.5 text-white font-bold min-w-[160px] text-center border-l border-[#1f384d]"
                >
                  <div className="text-sm">{court.name}</div>
                  <div className="text-[10px] text-gray-400 font-normal">
                    {court.status === "Maintenance"
                      ? "⚠️ Maintenance"
                      : court.type}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f384d]">
            {TIME_SLOTS.map((slot) => {
              const hourPart = parseInt(slot.trim().split(" ")[0]);
              const isPM = slot.includes("PM");
              const isPeak = isPM && hourPart >= 6 && hourPart !== 12;

              return (
                <tr
                  key={slot}
                  className="hover:bg-[#0c1a25]/50 transition-colors"
                >
                  {/* Time column */}
                  <td className="p-3 font-semibold text-gray-300 sticky left-0 bg-[#112233] z-10 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>{slot}</span>
                    {isPeak && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-bold">
                        PEAK
                      </span>
                    )}
                  </td>

                  {/* Courts cells */}
                  {courts.map((court) => {
                    if (court.status === "Maintenance") {
                      return (
                        <td
                          key={court.courtId}
                          className="p-2 border-l border-[#1f384d] text-center bg-amber-500/5"
                        >
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium flex items-center justify-center gap-1">
                            <Wrench className="w-3 h-3" /> Maintenance
                          </div>
                        </td>
                      );
                    }

                    // Find if booked
                    const booking = dayBookings.find(
                      (b) =>
                        b.courtId === court.courtId &&
                        b.time.trim() === slot.trim(),
                    );

                    if (booking) {
                      const isCompleted = booking.status === "COMPLETED";
                      return (
                        <td
                          key={court.courtId}
                          className="p-2 border-l border-[#1f384d]"
                        >
                          <div
                            className={`p-2 rounded-lg border text-left ${
                              isCompleted
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                                : "bg-[#00f0ff]/10 border-[#00f0ff]/40 text-white"
                            }`}
                          >
                            <div className="font-bold truncate text-[11px]">
                              {booking.customerName}
                            </div>
                            <div className="text-[10px] text-gray-400 flex items-center justify-between mt-0.5">
                              <span>{booking.customerMobile}</span>
                              <span
                                className={`font-semibold ${
                                  booking.paymentStatus === "Paid"
                                    ? "text-emerald-400"
                                    : "text-amber-400"
                                }`}
                              >
                                {booking.paymentStatus === "Paid"
                                  ? "✓ Paid"
                                  : "⏳ Due"}
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Available Slot
                    return (
                      <td
                        key={court.courtId}
                        className="p-2 border-l border-[#1f384d] text-center"
                      >
                        <button
                          onClick={() =>
                            onOpenBookingForSlot(
                              court.courtId,
                              selectedDate,
                              slot,
                            )
                          }
                          className="w-full py-2 px-2 rounded-lg bg-emerald-500/5 hover:bg-[#00f0ff]/10 border border-dashed border-emerald-500/20 hover:border-[#00f0ff] text-emerald-400 hover:text-[#00f0ff] transition-all flex items-center justify-center gap-1 text-[11px] font-medium group"
                        >
                          <Plus className="w-3 h-3 group-hover:scale-125 transition-transform" />
                          <span>
                            Rs. {isPeak ? court.peakPrice : court.basePrice}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
