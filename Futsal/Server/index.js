const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Booking = require("./models/Booking");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/futsal_db";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL of your Client
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Listen for booking details from the client
  socket.on("booking_details", (data) => {
    console.log("Received booking details:", data);

    io.emit("admin_notification", {
      message: "New Booking Alert!",
      details: data,
      timestamp: new Date(),
    });

    console.log("Notification sent to admin.");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- API ROUTES ---

// 1. Get Bookings (Availability check or all confirmed bookings)
app.get("/api/bookings", async (req, res) => {
  try {
    const { date, time } = req.query;

    if (date && time) {
      // Return list of courtIds that are booked for this date and time
      const booked = await Booking.find({
        date,
        time,
        status: "CONFIRMED",
      }).select("courtId");

      const bookedCourts = booked.map((b) => b.courtId);
      return res.json(bookedCourts);
    }

    // Return all bookings
    const allBookings = await Booking.find().sort({ createdAt: -1 });
    res.json(allBookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 2. Create a new Booking
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      bookingId,
      customerName,
      customerMobile,
      courtId,
      courtName,
      date,
      time,
      price,
    } = req.body;

    if (!customerName || !customerMobile || !courtId || !date || !time) {
      return res
        .status(400)
        .json({ error: "Missing required booking details." });
    }

    // Check if slot is already booked
    const existing = await Booking.findOne({
      courtId,
      date,
      time,
      status: "CONFIRMED",
    });

    if (existing) {
      return res.status(409).json({
        error: "This court is already booked for the selected date and time.",
      });
    }

    const uniqueBookingId =
      bookingId || `BK_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newBooking = new Booking({
      bookingId: uniqueBookingId,
      customerName,
      customerMobile,
      courtId,
      courtName: courtName || `Court ${courtId}`,
      date,
      time,
      price: price || 2500,
      status: "CONFIRMED",
      paymentStatus: "Pay at Venue",
    });

    await newBooking.save();

    console.log("Saved new booking to MongoDB:", newBooking.bookingId);

    // Broadcast real-time court availability update to all clients
    io.emit("booking_update", {
      courtId: newBooking.courtId,
      date: newBooking.date,
      time: newBooking.time,
    });

    // Broadcast admin notification
    io.emit("admin_notification", {
      message: "New Booking Alert!",
      details: newBooking,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to save booking: " + err.message });
  }
});

// 3. Get single booking by bookingId
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    console.error("Error retrieving booking:", err);
    res.status(500).json({ error: "Failed to retrieve booking" });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
