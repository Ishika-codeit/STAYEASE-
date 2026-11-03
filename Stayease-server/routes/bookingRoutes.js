const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getHostReceivedBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authmiddleware");

// All booking routes require authentication
router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/host/received", authorize("host", "admin"), getHostReceivedBookings);
router.get("/:id", getBookingById);
router.put("/:id/status", updateBookingStatus);

module.exports = router;
