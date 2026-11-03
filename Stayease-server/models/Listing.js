const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Tourist Stay",
        "Student PG / Hostel",
        "Coaching Stay",
        "Short Stay",
        "Parking Space",
        "Monthly Rooms",
      ],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    mapLocation: {
      type: String,
      default: function () {
        return this.location;
      },
    },
    coordinates: {
      lat: { type: Number, default: 25.3176 }, // Default Varanasi
      lng: { type: Number, default: 82.9739 },
    },
    price: {
      type: String,
      required: true,
    },
    priceNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePeriod: {
      type: String,
      default: "month", // "month", "night", "hour", "4 hours"
    },
    roomType: {
      type: String,
      required: true,
      default: "Private Room",
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: "New",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: [reviewSchema],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "flagged"],
      default: "approved",
    },
    aiPriceEstimate: {
      type: Number,
    },
    aiRiskScore: {
      type: Number,
      default: 0,
    },
    isSuspicious: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.pre("save", function () {
  if (this.price && (!this.priceNumber || this.priceNumber === 0)) {
    const numeric = parseInt(this.price.replace(/[^\d]/g, ""), 10);
    if (!isNaN(numeric)) {
      this.priceNumber = numeric;
    }
  }
});

module.exports = mongoose.model("Listing", listingSchema);
