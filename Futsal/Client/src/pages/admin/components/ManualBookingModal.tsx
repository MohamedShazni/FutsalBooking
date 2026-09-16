import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Phone, Info } from "lucide-react";
import axios from "axios";
import { Court } from "../types";

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courts: Court[];
  onBookingCreated: () => void;
  initialCourtId?: number;
  initialDate?: string;
  initialTime?: string;
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

export const ManualBookingModal: React.FC<ManualBookingModalProps> = ({
  isOpen,
  onClose,
  courts,
  onBookingCreated,
  initialCourtId,
  initialDate,
  initialTime,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [courtId, setCourtId] = useState<number>(courts[0]?.courtId || 1);
  const [date, setDate] = useState(
    initialDate || new Date().toISOString().split("T")[0],
  );
  const [time, setTime] = useState(initialTime || "09 AM");
  const [paymentStatus, setPaymentStatus] = useState<
    "Paid" | "Pending" | "Pay at Venue"
  >("Paid");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookedCourtIds, setBookedCourtIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialCourtId) setCourtId(initialCourtId);
    if (initialDate) setDate(initialDate);
    if (initialTime) setTime(initialTime);
  }, [initialCourtId, initialDate, initialTime, isOpen]);

  // Check booked courts for selected date and time
  useEffect(() => {
    if (date && time) {
      axios
        .get(`http://localhost:3001/api/bookings?date=${date}&time=${time}`)
        .then((res) => {
          setBookedCourtIds(res.data || []);
        })
        .catch((err) => console.error("Error fetching booked courts:", err));
    }
  }, [date, time]);

  if (!isOpen) return null;

  const selectedCourt =
    courts.find((c) => c.courtId === Number(courtId)) || courts[0];

  // Helper to calculate price
  const calculatePrice = (slotTime: string, court?: Court) => {
    if (!slotTime) return 2500;
    const hourPart = parseInt(slotTime.trim().split(" ")[0]);
    const isPM = slotTime.includes("PM");
    const isPeak = isPM && hourPart >= 6 && hourPart !== 12;

    if (court) {
      return isPeak ? court.peakPrice || 3000 : court.basePrice || 2500;
    }
    return isPeak ? 3000 : 2500;
  };

  const calculatedPrice = calculatePrice(time, selectedCourt);
  const isSelectedCourtBooked = bookedCourtIds.includes(Number(courtId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please enter customer name");
      return;
    }
    if (!customerMobile.trim() || !/^[0-9]{10}$/.test(customerMobile.trim())) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (isSelectedCourtBooked) {
      setError(
        "This court is already booked for the selected date and time slot.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const bookingPayload = {
        bookingId: `BK_WALK_${Date.now()}`,
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        courtId: selectedCourt.courtId,
        courtName: selectedCourt.name,
        date,
        time,
        price: calculatedPrice,
        status: "CONFIRMED",
        paymentStatus,
      };

      await axios.post("http://localhost:3001/api/bookings", bookingPayload);
      onBookingCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#112233] border border-[#1f384d] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f384d] bg-[#0c1a25]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00f0ff]/10 rounded-lg text-[#00f0ff] border border-[#00f0ff]/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                New Walk-in / Phone Booking
              </h2>
              <p className="text-xs text-gray-400">
                Record a manual reservation into the futsal system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#162c3e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00f0ff]" /> Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#00f0ff]" /> Mobile Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="0771234567"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          {/* Court Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Select Court *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {courts.map((court) => {
                const isSelected = Number(courtId) === court.courtId;
                const isBooked = bookedCourtIds.includes(court.courtId);
                const isMaintenance = court.status === "Maintenance";

                return (
                  <button
                    key={court.courtId}
                    type="button"
                    disabled={isMaintenance}
                    onClick={() => setCourtId(court.courtId)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#00f0ff]/10 border-[#00f0ff] text-white shadow-md shadow-[#00f0ff]/10"
                        : isMaintenance
                          ? "bg-[#162c3e]/40 border-gray-700/50 text-gray-500 opacity-60 cursor-not-allowed"
                          : isBooked
                            ? "bg-red-500/10 border-red-500/30 text-gray-300"
                            : "bg-[#0c1a25] border-[#1f384d] text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <p className="font-bold text-sm text-white">{court.name}</p>
                    <p className="text-[11px] text-gray-400">{court.type}</p>
                    {isBooked ? (
                      <span className="inline-block mt-1 text-[10px] text-red-400 font-semibold">
                        Slot Taken
                      </span>
                    ) : isMaintenance ? (
                      <span className="inline-block mt-1 text-[10px] text-amber-400 font-semibold">
                        Maintenance
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[10px] text-[#00f0ff]">
                        Available
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00f0ff]" /> Booking Date
                *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00f0ff]" /> Time Slot *
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00f0ff]"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} (
                    {slot.includes("PM") &&
                    parseInt(slot.trim()) >= 6 &&
                    parseInt(slot.trim()) !== 12
                      ? "Peak Rate"
                      : "Standard Rate"}
                    )
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Status & Amount Summary */}
          <div className="bg-[#0c1a25] border border-[#1f384d] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Payment Status
              </label>
              <div className="flex gap-2">
                {(["Paid", "Pending", "Pay at Venue"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setPaymentStatus(status)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        paymentStatus === status
                          ? status === "Paid"
                            ? "bg-emerald-500 text-black"
                            : status === "Pending"
                              ? "bg-amber-400 text-black"
                              : "bg-[#00f0ff] text-black"
                          : "bg-[#162c3e] text-gray-400 hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block">Total Fee</span>
              <span className="text-2xl font-bold text-[#00f0ff]">
                Rs. {calculatedPrice}
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1f384d] bg-[#0c1a25]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#162c3e] hover:bg-[#1f384d] text-gray-300 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isSelectedCourtBooked}
            className="px-6 py-2.5 bg-[#00f0ff] hover:bg-white text-black font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-[#00f0ff]/20 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Confirm & Save Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};
