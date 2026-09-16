const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema(
  {
    courtId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "Indoor",
    },
    surface: {
      type: String,
      default: "Artificial Turf (40mm)",
    },
    basePrice: {
      type: Number,
      required: true,
      default: 2500,
    },
    peakPrice: {
      type: Number,
      required: true,
      default: 3000,
    },
    status: {
      type: String,
      enum: ["Active", "Maintenance", "Inactive"],
      default: "Active",
    },
    capacity: {
      type: String,
      default: "5 vs 5 (10 Players)",
    },
    features: {
      type: [String],
      default: ["LED Floodlights", "Spectator Seating", "Changing Rooms", "Digital Scoreboard"],
    },
    description: {
      type: String,
      default: "Standard futsal court equipped with premium synthetic turf and tournament lighting.",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Court", courtSchema);
