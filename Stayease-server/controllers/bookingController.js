const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Create a new booking (Guest)
const createBooking = async (req, res) => {
  try {
    const {
      listingId,
      name,
      email,
      phone,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests,
    } = req.body;

    if (!listingId || !name || !phone || !checkInDate) {
      return res.status(400).json({
        message: "Listing, guest name, phone, and check-in date are required.",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (!listing.available) {
      return res.status(400).json({
        message: "This property is currently not available for booking.",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = checkOutDate ? new Date(checkOutDate) : new Date(checkIn.getTime() + 86400000);

    // Calculate total amount
    let unitPrice = listing.priceNumber || parseInt(String(listing.price).replace(/[^\d]/g, ""), 10) || 1000;
    let days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (days <= 0) days = 1;

    let totalAmount = unitPrice;
    if (listing.category === "Tourist Stay" || listing.category === "Short Stay") {
      totalAmount = unitPrice * days;
    } else if (listing.pricePeriod === "month") {
      // Monthly booking
      totalAmount = unitPrice;
    }

    // Check for conflicting active confirmed bookings on identical dates
    const existingConflict = await Booking.findOne({
      listing: listingId,
      status: "Confirmed",
      $or: [
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkIn },
        },
      ],
    });

    if (existingConflict) {
      return res.status(400).json({
        message: "The requested dates are already booked for this property. Please choose different dates.",
      });
    }

    const booking = await Booking.create({
      listing: listing._id,
      host: listing.host,
      guest: req.user.id,
      listingTitle: listing.title,
      listingImage: listing.image || (listing.images && listing.images[0]) || "",
      location: listing.location,
      price: listing.price,
      totalAmount,
      name: name.trim(),
      email: email ? email.trim() : req.user.email || "",
      phone: phone.trim(),
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: guests || 1,
      specialRequests: specialRequests || "",
      status: "Pending",
      paymentStatus: "Unpaid",
    });

    // Notify host about the new booking
    try {
      await Notification.create({
        recipient: listing.host,
        sender: req.user.id,
        title: "New Booking Request 📬",
        message: `${name} has requested a booking for "${listing.title}".`,
        type: "booking",
        link: "/mylistings",
      });
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    res.status(201).json({
      message: "Booking request submitted successfully! 🎉",
      booking,
    });
  } catch (error) {
    console.error("CREATE_BOOKING ERROR:", error);
    res.status(500).json({
      message: error.message || "Failed to create booking.",
    });
  }
};

// Get guest bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate("listing", "title category location image price rating")
      .populate("host", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET_MY_BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your bookings." });
  }
};

// Get bookings received by host
const getHostReceivedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user.id })
      .populate("listing", "title category location image price")
      .populate("guest", "fullName email phone avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET_HOST_BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch received bookings." });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("listing")
      .populate("host", "fullName email phone")
      .populate("guest", "fullName email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Only host, guest, or admin can view
    const isGuest = booking.guest._id.toString() === req.user.id;
    const isHost = booking.host._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this booking." });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("GET_BOOKING_BY_ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch booking." });
  }
};

// Update booking status (Host: Confirm/Reject, Guest: Cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed", "Rejected"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const isGuest = booking.guest.toString() === req.user.id;
    const isHost = booking.host.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    // Guest can only Cancel
    if (isGuest && !isHost && !isAdmin) {
      if (status !== "Cancelled") {
        return res.status(403).json({ message: "Guests can only cancel bookings." });
      }
    }

    // Host can Confirm, Reject, Complete, Cancel
    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this booking." });
    }

    booking.status = status;
    await booking.save();

    // Send notification to the other party
    try {
      const recipientId = isGuest ? booking.host : booking.guest;
      const actorName = req.user.role === "admin" ? "StayEase Admin" : (isHost ? "Host" : "Guest");

      await Notification.create({
        recipient: recipientId,
        sender: req.user.id,
        title: `Booking ${status} 🔔`,
        message: `Your booking for "${booking.listingTitle}" has been marked as ${status} by ${actorName}.`,
        type: "status_change",
        link: isGuest ? "/mylistings" : "/mybookings",
      });
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    res.status(200).json({
      message: `Booking status updated to ${status} ✅`,
      booking,
    });
  } catch (error) {
    console.error("UPDATE_BOOKING_STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update booking status." });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getHostReceivedBookings,
  getBookingById,
  updateBookingStatus,
};
