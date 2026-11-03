const express = require("express");
const router = express.Router();

const {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminListings,
  updateListingStatus,
  getAllBookings,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authmiddleware");

// Admin only routes
router.use(protect, authorize("admin"));

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/listings", getAdminListings);
router.put("/listings/:id/status", updateListingStatus);
router.get("/bookings", getAllBookings);

module.exports = router;
