const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerMobile: {
    type: String,
    required: true,
    trim: true,
  },
  courtId: {
    type: Number,
    required: true,
  },
  courtName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true, // Format: YYYY-MM-DD
  },
  time: {
    type: String,
    required: true, // Format: e.g. "09 AM"
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED"],
    default: "CONFIRMED",
  },
  paymentStatus: {
    type: String,
    default: "Pay at Venue",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
