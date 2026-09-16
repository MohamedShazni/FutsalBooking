const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Booking = require("./models/Booking");
const Court = require("./models/Court");

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
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    await seedDefaultCourts();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Seed default courts if none exist
async function seedDefaultCourts() {
  try {
    const count = await Court.countDocuments();
    if (count === 0) {
      const defaultCourts = [
        {
          courtId: 1,
          name: "Court A",
          type: "Indoor",
          surface: "Premium Artificial Turf (40mm)",
          basePrice: 2500,
          peakPrice: 3000,
          status: "Active",
          capacity: "5 vs 5 (10 Players)",
          features: ["LED Floodlights", "Spectator Seating", "Changing Rooms", "Digital Scoreboard"],
          description: "Main tournament court with FIFA standard shock-absorbent artificial grass.",
        },
        {
          courtId: 2,
          name: "Court B",
          type: "Indoor",
          surface: "Synthetic Polyurethane Turf",
          basePrice: 2500,
          peakPrice: 3000,
          status: "Active",
          capacity: "5 vs 5 (10 Players)",
          features: ["LED Floodlights", "Changing Rooms", "Air Conditioning Lounge", "Beverage Bar"],
          description: "High performance indoor court optimal for club matches and competitive training.",
        },
        {
          courtId: 3,
          name: "Court C",
          type: "Indoor",
          surface: "Premium Artificial Turf (40mm)",
          basePrice: 2500,
          peakPrice: 3000,
          status: "Active",
          capacity: "5 vs 5 (10 Players)",
          features: ["LED Floodlights", "Spectator Seating", "Equipment Rental", "Free Wi-Fi"],
          description: "Fast-paced indoor court suitable for all skill levels and casual night matches.",
        },
        {
          courtId: 4,
          name: "Court D",
          type: "Indoor",
          surface: "Multi-Sport Synthetic Grass",
          basePrice: 2500,
          peakPrice: 3000,
          status: "Active",
          capacity: "5 vs 5 (10 Players)",
          features: ["LED Floodlights", "Spectator Gallery", "Shower Facilities", "First Aid Kit"],
          description: "Spacious training court perfect for corporate tournaments and weekend leagues.",
        },
      ];
      await Court.insertMany(defaultCourts);
      console.log("Seeded initial default courts (Courts A, B, C, D)");
    }
  } catch (err) {
    console.error("Error seeding courts:", err.message);
  }
}

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // URL of your Client
    methods: ["GET", "POST", "PUT", "DELETE"],
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

// ================= COURTS API =================

// 1. Get all courts
app.get("/api/courts", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const courts = await Court.find(filter).sort({ courtId: 1 });
    res.json(courts);
  } catch (err) {
    console.error("Error fetching courts:", err);
    res.status(500).json({ error: "Failed to fetch courts" });
  }
});

// 2. Get single court by courtId or _id
app.get("/api/courts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let court;
    if (!isNaN(id)) {
      court = await Court.findOne({ courtId: Number(id) });
    } else {
      court = await Court.findById(id);
    }
    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }
    res.json(court);
  } catch (err) {
    console.error("Error retrieving court:", err);
    res.status(500).json({ error: "Failed to retrieve court" });
  }
});

// 3. Create a new Court
app.post("/api/courts", async (req, res) => {
  try {
    const {
      courtId,
      name,
      type,
      surface,
      basePrice,
      peakPrice,
      status,
      capacity,
      features,
      description,
      imageUrl,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Court name is required" });
    }

    let nextCourtId = courtId;
    if (!nextCourtId) {
      const highest = await Court.findOne().sort({ courtId: -1 });
      nextCourtId = highest ? highest.courtId + 1 : 1;
    } else {
      const exists = await Court.findOne({ courtId: nextCourtId });
      if (exists) {
        return res.status(400).json({ error: `Court ID ${nextCourtId} already exists` });
      }
    }

    const newCourt = new Court({
      courtId: nextCourtId,
      name,
      type: type || "Indoor",
      surface: surface || "Artificial Turf (40mm)",
      basePrice: basePrice ? Number(basePrice) : 2500,
      peakPrice: peakPrice ? Number(peakPrice) : 3000,
      status: status || "Active",
      capacity: capacity || "5 vs 5 (10 Players)",
      features: features || ["LED Floodlights", "Spectator Seating", "Changing Rooms"],
      description: description || "",
      imageUrl: imageUrl || "",
    });

    await newCourt.save();

    // Broadcast court update
    io.emit("court_update", { action: "create", court: newCourt });

    res.status(201).json({
      success: true,
      message: "Court created successfully",
      court: newCourt,
    });
  } catch (err) {
    console.error("Error creating court:", err);
    res.status(500).json({ error: "Failed to create court: " + err.message });
  }
});

// 4. Update Court
app.put("/api/courts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let query = {};
    if (!isNaN(id)) {
      query = { courtId: Number(id) };
    } else {
      query = { _id: id };
    }

    const updated = await Court.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Court not found" });
    }

    // Broadcast court update
    io.emit("court_update", { action: "update", court: updated });

    res.json({
      success: true,
      message: "Court updated successfully",
      court: updated,
    });
  } catch (err) {
    console.error("Error updating court:", err);
    res.status(500).json({ error: "Failed to update court: " + err.message });
  }
});

// 5. Delete Court
app.delete("/api/courts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let query = {};
    if (!isNaN(id)) {
      query = { courtId: Number(id) };
    } else {
      query = { _id: id };
    }

    const deleted = await Court.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ error: "Court not found" });
    }

    // Broadcast court deletion
    io.emit("court_update", { action: "delete", courtId: deleted.courtId });

    res.json({
      success: true,
      message: "Court deleted successfully",
      courtId: deleted.courtId,
    });
  } catch (err) {
    console.error("Error deleting court:", err);
    res.status(500).json({ error: "Failed to delete court" });
  }
});

// ================= BOOKINGS API =================

// 1. Get Bookings (Availability check or all bookings with optional query filters)
app.get("/api/bookings", async (req, res) => {
  try {
    const { date, time, status, courtId } = req.query;

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

    const filter = {};
    if (status) filter.status = status;
    if (courtId) filter.courtId = Number(courtId);
    if (date) filter.date = date;

    const allBookings = await Booking.find(filter).sort({ createdAt: -1 });
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
      status,
      paymentStatus,
    } = req.body;

    if (!customerName || !customerMobile || !courtId || !date || !time) {
      return res
        .status(400)
        .json({ error: "Missing required booking details." });
    }

    // Check if slot is already booked
    const existing = await Booking.findOne({
      courtId: Number(courtId),
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
      courtId: Number(courtId),
      courtName: courtName || `Court ${courtId}`,
      date,
      time,
      price: price || 2500,
      status: status || "CONFIRMED",
      paymentStatus: paymentStatus || "Pay at Venue",
    });

    await newBooking.save();

    console.log("Saved new booking to MongoDB:", newBooking.bookingId);

    // Broadcast real-time court availability update to all clients
    io.emit("booking_update", {
      courtId: newBooking.courtId,
      date: newBooking.date,
      time: newBooking.time,
      booking: newBooking,
    });

    // Broadcast admin notification
    io.emit("admin_notification", {
      message: `New booking: ${newBooking.customerName} for ${newBooking.courtName} at ${newBooking.time}`,
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

// 3. Update Booking (Status, Payment, or Details)
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({
      $or: [{ bookingId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const fieldsToUpdate = [
      "status",
      "paymentStatus",
      "customerName",
      "customerMobile",
      "courtId",
      "courtName",
      "date",
      "time",
      "price",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });

    await booking.save();

    io.emit("booking_update", {
      action: "update",
      courtId: booking.courtId,
      date: booking.date,
      time: booking.time,
      booking,
    });

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Failed to update booking: " + err.message });
  }
});

// 4. Delete / Cancel Booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Booking.findOneAndDelete({
      $or: [{ bookingId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
    });

    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }

    io.emit("booking_update", {
      action: "delete",
      courtId: deleted.courtId,
      date: deleted.date,
      time: deleted.time,
      bookingId: deleted.bookingId,
    });

    res.json({
      success: true,
      message: "Booking deleted successfully",
      bookingId: deleted.bookingId,
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

// 5. Get single booking by bookingId
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ bookingId: req.params.id }, { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null }],
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    console.error("Error retrieving booking:", err);
    res.status(500).json({ error: "Failed to retrieve booking" });
  }
});

// ================= ADMIN STATS API =================

app.get("/api/admin/stats", async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    const [allBookings, allCourts] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }),
      Court.find().sort({ courtId: 1 }),
    ]);

    const totalBookings = allBookings.length;
    const confirmedBookings = allBookings.filter((b) => b.status === "CONFIRMED").length;
    const cancelledBookings = allBookings.filter((b) => b.status === "CANCELLED").length;
    const completedBookings = allBookings.filter((b) => b.status === "COMPLETED").length;

    const totalRevenue = allBookings
      .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.price || 0), 0);

    const paidRevenue = allBookings
      .filter((b) => b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + (b.price || 0), 0);

    const todayBookings = allBookings.filter((b) => b.date === todayStr);
    const todayRevenue = todayBookings
      .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.price || 0), 0);

    const totalCourts = allCourts.length;
    const activeCourts = allCourts.filter((c) => c.status === "Active").length;
    const maintenanceCourts = allCourts.filter((c) => c.status === "Maintenance").length;

    // Court usage statistics
    const courtUsage = allCourts.map((c) => {
      const courtBookings = allBookings.filter((b) => b.courtId === c.courtId);
      const revenue = courtBookings
        .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
        .reduce((sum, b) => sum + (b.price || 0), 0);

      return {
        courtId: c.courtId,
        name: c.name,
        type: c.type,
        status: c.status,
        bookingsCount: courtBookings.length,
        revenue,
      };
    });

    res.json({
      summary: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue,
        paidRevenue,
        pendingRevenue: totalRevenue - paidRevenue,
        todayBookingsCount: todayBookings.length,
        todayRevenue,
        totalCourts,
        activeCourts,
        maintenanceCourts,
      },
      courtUsage,
      recentBookings: allBookings.slice(0, 8),
      todayBookings,
      courts: allCourts,
    });
  } catch (err) {
    console.error("Error compiling admin stats:", err);
    res.status(500).json({ error: "Failed to compile admin stats" });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
