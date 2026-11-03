const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingTitle: {
      type: String,
      required: true,
    },
    listingImage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed", "Rejected"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
    paymentId: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
