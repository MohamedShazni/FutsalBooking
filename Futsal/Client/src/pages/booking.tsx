import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image3 from "../assets/5.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { useEffect } from "react";

// Booking Page Component
const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerName, customerMobile } = location.state || {}; // Retrieve data passed from ContactPage

  const handleBack = () => {
    navigate("/contact");
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<{
    id: number;
    name: string;
    price: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [courts, setCourts] = useState<any[]>([
    { id: 1, courtId: 1, name: "Court A", type: "Indoor", basePrice: 2500, peakPrice: 3000, status: "Active" },
    { id: 2, courtId: 2, name: "Court B", type: "Indoor", basePrice: 2500, peakPrice: 3000, status: "Active" },
    { id: 3, courtId: 3, name: "Court C", type: "Indoor", basePrice: 2500, peakPrice: 3000, status: "Active" },
    { id: 4, courtId: 4, name: "Court D", type: "Indoor", basePrice: 2500, peakPrice: 3000, status: "Active" },
  ]);

  // Fetch courts from backend API
  const fetchCourts = () => {
    axios
      .get("http://localhost:3001/api/courts")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCourts(
            res.data.map((c: any) => ({
              ...c,
              id: c.courtId || c.id,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching courts:", err));
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const timeSlots = [
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

  // ... (inside component) ...
  const [bookedCourts, setBookedCourts] = useState<number[]>([]);

  // Fetch availability when date/time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      axios
        .get(
          `http://localhost:3001/api/bookings?date=${selectedDate}&time=${selectedTime}`,
        )
        .then((res) => {
          setBookedCourts(res.data);
        })
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, [selectedDate, selectedTime]);

  // Listen for real-time updates
  useEffect(() => {
    socket.on("booking_update", (data: any) => {
      if (data.date === selectedDate && data.time === selectedTime) {
        setBookedCourts((prev) => [...prev, data.courtId]);
      }
    });

    socket.on("court_update", () => {
      fetchCourts();
    });

    return () => {
      socket.off("booking_update");
      socket.off("court_update");
    };
  }, [selectedDate, selectedTime]);

  // Helper to determine price based on time and court
  const getPrice = (time: string, court?: any) => {
    if (!time) return court?.basePrice || 2500;

    // Parse hour from string "09 AM", " 6 PM"
    const hourPart = parseInt(time.trim().split(" ")[0]);
    const isPM = time.includes("PM");

    // Evening rates (6 PM - 11 PM)
    if (isPM && hourPart >= 6 && hourPart !== 12) {
      return court?.peakPrice || 3000;
    }

    // Default rate (AM and early PM)
    return court?.basePrice || 2500;
  };

  const handleBooking = (court: any) => {
    const cId = court.courtId || court.id;
    if (court.status === "Maintenance") {
      alert("This court is currently under maintenance.");
      return;
    }

    if (bookedCourts.includes(cId)) {
      alert("This court is already booked for the selected time.");
      return;
    }

    if (selectedDate && selectedTime) {
      // Validate Date is not in the past
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate < today) {
        alert("Please select a valid date (today or in the future).");
        return;
      }

      // Create a court object with the dynamic price
      const price = getPrice(selectedTime, court);
      setSelectedCourt({ id: cId, name: court.name, price });
      setShowConfirmation(true);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#0c1a25]">
        {/* Image Section */}
        <div className="w-full md:w-2/3 relative h-[30vh] md:h-auto order-1 md:order-1">
          <img
            src={Image3}
            alt="futsal"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-white px-5 py-10 md:py-0 order-2 md:order-2">
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold text-white mb-6 mt-10">
              Futsal Court Booking
            </h1>

            {/* Buttons */}
            <button
              onClick={handleBack}
              className="bg-[#00f0ff] text-black font-medium px-6 py-2 rounded-lg mb-4 hover:bg-white"
            >
              Go Back to Contact
            </button>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 gap-6 mb-8 w-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Calendar className="w-5 h-5" /> Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border rounded-lg text-white"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Clock className="w-5 h-5" /> Select Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          selectedTime === time
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Court List */}
            <div className="grid grid-cols-2 gap-6 mb-8 w-full">
              {courts.map((court) => {
                const cId = court.courtId || court.id;
                const isMaintenance = court.status === "Maintenance";
                const isBooked = bookedCourts.includes(cId);

                return (
                  <Card
                    key={cId}
                    className={`hover:shadow-lg transition-shadow relative overflow-hidden ${
                      isMaintenance ? "opacity-75 border-amber-500/40" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{court.name}</CardTitle>
                        {isMaintenance && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-500 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                            Maintenance
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{court.type || "Indoor"}</p>
                      <p className="text-[18px] mb-6 font-semibold">
                        Rs. {selectedTime ? getPrice(selectedTime, court) : `${court.basePrice || 2500} - ${court.peakPrice || 3000}`}{" "}
                        /hour
                      </p>
                      <button
                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
                          isMaintenance
                            ? "bg-amber-500 text-black cursor-not-allowed font-semibold"
                            : isBooked
                            ? "bg-red-500 text-white cursor-not-allowed" // Booked style
                            : selectedDate && selectedTime
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleBooking(court)}
                        disabled={
                          isMaintenance ||
                          !selectedDate ||
                          !selectedTime ||
                          isBooked
                        }
                      >
                        {isMaintenance
                          ? "Maintenance"
                          : isBooked
                          ? "Booked"
                          : "Book Now"}
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Alert if date/time not selected */}
            {(!selectedDate || !selectedTime) && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription>
                  Please select both date and time to proceed with booking
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Confirm Booking</CardTitle>
              <button
                onClick={() => setShowConfirmation(false)}
                className="p-2 bg-white hover:bg-black rounded-full hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-600">Court</p>
                  <p className="font-medium">{selectedCourt.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{selectedDate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Time</p>
                  <p className="font-medium">{selectedTime}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Price</p>
                  <p className="font-medium">Rs. {selectedCourt.price}</p>
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={async () => {
                    setIsSubmitting(true);
                    const bookingId = "BK_" + new Date().getTime();

                    const bookingPayload = {
                      bookingId,
                      customerName: customerName || "Guest User",
                      customerMobile: customerMobile || "0771234567",
                      courtId: selectedCourt.id,
                      courtName: selectedCourt.name,
                      date: selectedDate,
                      time: selectedTime,
                      price: selectedCourt.price,
                    };

                    try {
                      const response = await axios.post(
                        "http://localhost:3001/api/bookings",
                        bookingPayload,
                      );

                      if (response.data.success || response.status === 201) {
                        setShowConfirmation(false);
                        navigate("/confirmation", {
                          state: {
                            ...bookingPayload,
                            booking: response.data.booking,
                            court: selectedCourt,
                            orderId:
                              response.data.booking?.bookingId || bookingId,
                          },
                        });
                      }
                    } catch (error: any) {
                      console.error("Booking error:", error);
                      const msg =
                        error.response?.data?.error ||
                        "Failed to save booking. Please check database connection.";
                      alert(msg);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "Saving Booking..." : "Confirm Booking"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
