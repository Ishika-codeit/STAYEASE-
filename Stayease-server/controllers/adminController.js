const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// Get platform overview statistics
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: "host" });
    const totalGuests = await User.countDocuments({ role: "guest" });

    const totalListings = await Listing.countDocuments();
    const approvedListings = await Listing.countDocuments({ status: "approved" });
    const pendingListings = await Listing.countDocuments({ status: "pending" });
    const flaggedListings = await Listing.countDocuments({ status: "flagged" });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "Confirmed" });

    // Calculate total revenue from paid bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const recentBookings = await Booking.find()
      .populate("guest", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        users: { total: totalUsers, hosts: totalHosts, guests: totalGuests },
        listings: {
          total: totalListings,
          approved: approvedListings,
          pending: pendingListings,
          flagged: flaggedListings,
        },
        bookings: { total: totalBookings, confirmed: confirmedBookings },
        revenue: totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("ADMIN_STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch platform statistics." });
  }
};

// Get all platform users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("ADMIN_USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["guest", "host", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User role updated successfully.", user });
  } catch (error) {
    console.error("UPDATE_USER_ROLE ERROR:", error);
    res.status(500).json({ message: "Failed to update role." });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Also remove their listings
    await Listing.deleteMany({ host: req.params.id });

    res.status(200).json({ message: "User and associated listings deleted." });
  } catch (error) {
    console.error("DELETE_USER ERROR:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

// Get all listings for admin (including flagged & pending)
const getAdminListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("host", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ listings });
  } catch (error) {
    console.error("ADMIN_LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch listings." });
  }
};

// Update listing status (approve, reject, flag)
const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "pending", "flagged"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status, isSuspicious: status === "flagged" },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.status(200).json({
      message: `Listing status updated to ${status}.`,
      listing,
    });
  } catch (error) {
    console.error("UPDATE_LISTING_STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update listing status." });
  }
};

// Get all bookings for admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("listing", "title category price")
      .populate("host", "fullName email")
      .populate("guest", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("ADMIN_BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAdminListings,
  updateListingStatus,
  getAllBookings,
};
