import { useNavigate, useLocation } from "react-router";
import Image4 from "../assets/b.jpg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CheckCircle2,
  Download,
  ArrowLeft,
  Home,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const handleBackToBooking = () => {
    navigate("/booking");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getCustomerNames = (fullName: string) => {
    const parts = (fullName || "Guest User").trim().split(" ");
    const first = parts[0];
    return { first };
  };

  const { first: firstName } = getCustomerNames(state.customerName || "Guest");

  const bookingDetails = {
    order_id: state.orderId || state.bookingId || "BK_" + new Date().getTime(),
    courtName: state.court?.name || state.courtName || "Futsal Court",
    amount: state.court?.price || state.price || 2500,
    currency: "LKR",
    first_name: firstName,
    phone: state.customerMobile || "0771234567",
    date: state.date || new Date().toISOString().split("T")[0],
    time: state.time || "09 AM",
    status: "CONFIRMED",
    paymentMethod: "Pay at Venue (Cash / Card)",
  };

  const generateBill = () => {
    const doc = new jsPDF();

    // Header background
    doc.setFillColor(12, 26, 37);
    doc.rect(0, 0, 210, 40, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("S7 Futsal & Sports", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Your Game, Your Court", 105, 30, { align: "center" });

    // Invoice Meta
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Booking Confirmation Receipt", 14, 55);

    doc.setFontSize(10);
    doc.text(`Booking Reference: ${bookingDetails.order_id}`, 14, 63);
    doc.text(`Issued Date: ${new Date().toLocaleDateString()}`, 14, 69);

    // Customer info
    doc.text(`Customer Name: ${bookingDetails.first_name}`, 14, 80);
    doc.text(`Mobile: ${bookingDetails.phone}`, 14, 86);

    // Table
    autoTable(doc, {
      startY: 96,
      head: [["Item Description", "Details"]],
      body: [
        ["Court Reserved", bookingDetails.courtName],
        ["Booking Date", bookingDetails.date],
        ["Booking Time Slot", bookingDetails.time],
        ["Total Amount", `Rs. ${bookingDetails.amount}.00`],
        ["Payment Method", bookingDetails.paymentMethod],
        ["Booking Status", "CONFIRMED"],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 240, 255], textColor: [0, 0, 0] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    // Note / Instructions
    const finalY = (doc as any).lastAutoTable?.finalY || 160;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      "Please arrive 10 minutes before your slot time.",
      14,
      finalY + 15,
    );
    doc.text(
      "Payment will be collected directly at the venue counter.",
      14,
      finalY + 22,
    );

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for booking with S7 Futsal!", 105, 280, {
      align: "center",
    });

    // Save PDF
    doc.save(`Futsal_Booking_${bookingDetails.order_id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0c1a25] flex flex-col md:flex-row text-white">
      {/* Left Content Card */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center py-12 px-6 md:px-12 order-2 md:order-1">
        <div className="w-full max-w-lg bg-[#112332] border border-[#1e384f] rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#00f0ff]" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Booking Confirmed!
              </h1>
              <p className="text-gray-400 text-sm">
                Your futsal slot is saved in our database.
              </p>
            </div>
          </div>

          <div className="bg-[#0c1a25] rounded-xl p-5 mb-6 border border-[#1a3348] space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#1a3348]">
              <span className="text-gray-400 text-sm">Booking ID</span>
              <span className="font-mono text-[#00f0ff] font-semibold text-sm">
                {bookingDetails.order_id}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4 text-[#00f0ff]" /> Customer Name
              </span>
              <span className="font-medium">{bookingDetails.first_name}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-400 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00f0ff]" /> Contact
              </span>
              <span className="font-medium">{bookingDetails.phone}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00f0ff]" /> Court
              </span>
              <span className="font-medium">{bookingDetails.courtName}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00f0ff]" /> Date
              </span>
              <span className="font-medium">{bookingDetails.date}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00f0ff]" /> Time Slot
              </span>
              <span className="font-medium">{bookingDetails.time}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#1a3348]">
              <span className="text-gray-400 font-semibold">Total Price</span>
              <span className="text-xl font-bold text-[#00f0ff]">
                Rs. {bookingDetails.amount}
              </span>
            </div>

            <div className="bg-[#152e42] p-3 rounded-lg text-xs text-yellow-300 flex items-center justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold">
                {bookingDetails.paymentMethod}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={generateBill}
              className="w-full bg-[#00f0ff] text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg"
            >
              <Download className="w-5 h-5" /> Download Booking Invoice (PDF)
            </button>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={handleBackToBooking}
                className="bg-[#1c354a] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#254663] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Book Another
              </button>

              <button
                onClick={handleGoHome}
                className="bg-[#1c354a] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#254663] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Home className="w-4 h-4" /> Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="w-full md:w-2/5 h-[40vh] md:h-screen relative order-1 md:order-2">
        <img
          src={Image4}
          alt="Futsal court"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c1a25] via-transparent to-transparent"></div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
