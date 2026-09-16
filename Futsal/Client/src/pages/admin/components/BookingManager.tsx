import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Booking, Court } from "../types";

interface BookingManagerProps {
  bookings: Booking[];
  courts: Court[];
  onOpenManualBooking: () => void;
  onUpdateBookingStatus: (
    bookingId: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED",
    paymentStatus?: "Paid" | "Pending" | "Pay at Venue",
  ) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  bookings,
  courts,
  onOpenManualBooking,
  onUpdateBookingStatus,
  onDeleteBooking,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerMobile.includes(searchTerm) ||
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.courtName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourt =
      selectedCourt === "All" || b.courtId === Number(selectedCourt);
    const matchesStatus =
      selectedStatus === "All" || b.status === selectedStatus;
    const matchesPayment =
      selectedPaymentStatus === "All" ||
      b.paymentStatus === selectedPaymentStatus;
    const matchesDate = !selectedDate || b.date === selectedDate;

    return (
      matchesSearch &&
      matchesCourt &&
      matchesStatus &&
      matchesPayment &&
      matchesDate
    );
  });

  const exportToCSV = () => {
    const headers = [
      "Booking ID",
      "Customer Name",
      "Mobile",
      "Court Name",
      "Date",
      "Time",
      "Price (LKR)",
      "Booking Status",
      "Payment Status",
      "Created At",
    ];

    const rows = filteredBookings.map((b) => [
      b.bookingId,
      `"${b.customerName}"`,
      b.customerMobile,
      `"${b.courtName}"`,
      b.date,
      b.time,
      b.price,
      b.status,
      `"${b.paymentStatus || "Pay at Venue"}"`,
      b.createdAt ? new Date(b.createdAt).toISOString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `S7_Futsal_Bookings_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printInvoice = (b: Booking) => {
    const doc = new jsPDF();

    doc.setFillColor(12, 26, 37);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("S7 Futsal & Sports", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Official Booking Receipt & Invoice", 105, 30, {
      align: "center",
    });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Invoice / Booking Ref: ${b.bookingId}`, 14, 55);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 62);
    doc.text(`Customer Name: ${b.customerName}`, 14, 69);
    doc.text(`Contact: ${b.customerMobile}`, 14, 76);

    autoTable(doc, {
      startY: 85,
      head: [["Item Description", "Details", "Amount (LKR)"]],
      body: [
        [
          `Futsal Court Reservation (${b.courtName})`,
          `Date: ${b.date} | Time: ${b.time}`,
          `Rs. ${b.price}.00`,
        ],
        ["Booking Status", b.status, "-"],
        ["Payment Mode", b.paymentStatus || "Pay at Venue", "-"],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 240, 255], textColor: [0, 0, 0] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 140;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: Rs. ${b.price}.00`, 14, finalY + 15);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for playing at S7 Futsal & Sports!", 105, 280, {
      align: "center",
    });

    doc.save(`Invoice_${b.bookingId}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone number, booking ref, or court..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0c1a25] border border-[#1f384d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={exportToCSV}
              className="bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] border border-[#1f384d] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
              title="Export Bookings to CSV"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>

            <button
              onClick={onOpenManualBooking}
              className="bg-[#00f0ff] hover:bg-white text-black font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-[#00f0ff]/20"
            >
              <Plus className="w-4 h-4" /> + New Walk-in Booking
            </button>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#1f384d]/60">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5 text-[#00f0ff]" /> Filter By:
          </div>

          {/* Court Filter */}
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="All">All Courts</option>
            {courts.map((c) => (
              <option key={c.courtId} value={c.courtId}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Booking Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="All">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Pay at Venue">Pay at Venue</option>
          </select>

          {/* Date Picker Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#0c1a25] border border-[#1f384d] rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00f0ff]"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                Clear Date
              </button>
            )}
          </div>

          <div className="ml-auto text-xs text-gray-400">
            Showing{" "}
            <span className="text-[#00f0ff] font-bold">
              {filteredBookings.length}
            </span>{" "}
            of {bookings.length} reservations
          </div>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-[#112233] border border-[#1f384d] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0c1a25] text-xs uppercase font-semibold text-gray-400 border-b border-[#1f384d]">
              <tr>
                <th className="px-5 py-4">Booking Ref</th>
                <th className="px-5 py-4">Customer Details</th>
                <th className="px-5 py-4">Court</th>
                <th className="px-5 py-4">Date & Slot</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Booking Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f384d]/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <Calendar className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    No bookings found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  return (
                    <tr
                      key={b.bookingId}
                      className="hover:bg-[#162c3e]/50 transition-colors"
                    >
                      {/* Booking ID */}
                      <td className="px-5 py-4 font-mono font-semibold text-[#00f0ff] text-xs">
                        {b.bookingId}
                      </td>

                      {/* Customer Name & Phone */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {b.customerName}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#00f0ff]" />
                          {b.customerMobile}
                        </div>
                      </td>

                      {/* Court */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#162c3e] border border-[#1f384d] text-white">
                          {b.courtName}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#00f0ff]" />
                          {b.date}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {b.time}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-bold text-white">
                        Rs. {b.price}
                      </td>

                      {/* Payment Status Switch */}
                      <td className="px-5 py-4">
                        <select
                          value={b.paymentStatus || "Pay at Venue"}
                          onChange={(e) =>
                            onUpdateBookingStatus(
                              b.bookingId,
                              b.status,
                              e.target.value as
                                | "Paid"
                                | "Pending"
                                | "Pay at Venue",
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            b.paymentStatus === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : b.paymentStatus === "Pending"
                                ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                                : "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30"
                          }`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Pay at Venue">Pay at Venue</option>
                        </select>
                      </td>

                      {/* Booking Status Dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            onUpdateBookingStatus(
                              b.bookingId,
                              e.target.value as
                                | "CONFIRMED"
                                | "CANCELLED"
                                | "COMPLETED",
                              b.paymentStatus,
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : b.status === "COMPLETED"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => printInvoice(b)}
                            className="p-1.5 bg-[#162c3e] hover:bg-[#1f384d] text-[#00f0ff] rounded-lg transition-colors border border-[#1f384d]"
                            title="Download PDF Bill"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete/cancel booking ${b.bookingId}?`,
                                )
                              ) {
                                onDeleteBooking(b.bookingId);
                              }
                            }}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
