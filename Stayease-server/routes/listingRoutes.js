const express = require("express");
const router = express.Router();

const {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  toggleAvailability,
  addReview,
} = require("../controllers/listingController");

const { protect, authorize } = require("../middleware/authmiddleware");

// Public routes
router.get("/", getAllListings);

// Host-specific routes (MUST be before /:id)
router.get("/host/my-listings", protect, authorize("host", "admin"), getMyListings);

// Single listing details
router.get("/:id", getListingById);

// Protected host/admin routes
router.post("/", protect, authorize("host", "admin"), createListing);
router.put("/:id", protect, authorize("host", "admin"), updateListing);
router.delete("/:id", protect, authorize("host", "admin"), deleteListing);
router.patch("/:id/availability", protect, authorize("host", "admin"), toggleAvailability);

// Protected review route
router.post("/:id/reviews", protect, addReview);

module.exports = router;
