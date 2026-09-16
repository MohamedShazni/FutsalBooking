import React, { useState } from "react";
import {
  Users,
  Phone,
  Calendar,
  Search,
  Plus,
  MessageSquare,
} from "lucide-react";
import { Booking, Court } from "../types";

interface CustomerDirectoryProps {
  bookings: Booking[];
  courts: Court[];
  onOpenBookingForCustomer: (
    customerName: string,
    customerMobile: string,
  ) => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
  bookings,
  onOpenBookingForCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Aggregate customer details from bookings
  const customerMap = new Map<
    string,
    {
      name: string;
      mobile: string;
      totalBookings: number;
      totalSpent: number;
      lastBookingDate: string;
      courtsUsed: Set<string>;
    }
  >();

  bookings.forEach((b) => {
    const key = b.customerMobile.trim();
    if (!key) return;

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: b.customerName,
        mobile: b.customerMobile,
        totalBookings: 0,
        totalSpent: 0,
        lastBookingDate: b.date,
        courtsUsed: new Set<string>(),
      });
    }

    const item = customerMap.get(key)!;
    item.totalBookings += 1;
    if (b.status !== "CANCELLED") {
      item.totalSpent += b.price || 0;
    }
    if (b.date > item.lastBookingDate) {
      item.lastBookingDate = b.date;
    }
    item.courtsUsed.add(b.courtName);
  });

  const customerList = Array.from(customerMap.values()).sort(
    (a, b) => b.totalBookings - a.totalBookings,
  );

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00f0ff]/10 rounded-xl text-[#00f0ff] border border-[#00f0ff]/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Player & Customer Directory
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Profiles compiled from verified online and walk-in reservations.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search players by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white">
            No customer records found
          </h4>
          <p className="text-sm text-gray-400 mt-1">
            Bookings will automatically build player profiles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((cust) => {
            const isFrequent = cust.totalBookings >= 3;

            return (
              <div
                key={cust.mobile}
                className="bg-[#112233] border border-[#1f384d] rounded-2xl p-5 shadow-lg hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-white">
                          {cust.name}
                        </h4>
                        {isFrequent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                            VIP Player
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-[#00f0ff]" />{" "}
                        {cust.mobile}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#0c1a25] border border-[#1f384d] flex items-center justify-center text-sm font-bold text-[#00f0ff]">
                      {cust.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4">
                    <div className="bg-[#0c1a25] border border-[#1f384d] rounded-xl p-3">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">
                        Total Matches
                      </span>
                      <span className="text-lg font-extrabold text-white">
                        {cust.totalBookings}{" "}
                        <span className="text-xs font-normal text-gray-400">
                          slots
                        </span>
                      </span>
                    </div>

                    <div className="bg-[#0c1a25] border border-[#1f384d] rounded-xl p-3">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">
                        Total Spent
                      </span>
                      <span className="text-lg font-extrabold text-[#00f0ff]">
                        Rs. {cust.totalSpent}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 flex items-center justify-between pt-2 border-t border-[#1f384d]/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" /> Last
                      match:
                    </span>
                    <span className="text-gray-300 font-medium">
                      {cust.lastBookingDate}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1f384d] flex items-center gap-2">
                  <a
                    href={`tel:${cust.mobile}`}
                    className="flex-1 py-2 px-3 bg-[#162c3e] hover:bg-[#1f384d] text-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#00f0ff]" /> Call
                  </a>

                  <a
                    href={`https://wa.me/${cust.mobile.startsWith("0") ? "94" + cust.mobile.substring(1) : cust.mobile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-[#162c3e] hover:bg-[#1f384d] text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    title="Open WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() =>
                      onOpenBookingForCustomer(cust.name, cust.mobile)
                    }
                    className="flex-1 py-2 px-3 bg-[#00f0ff] hover:bg-white text-black rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Slot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
