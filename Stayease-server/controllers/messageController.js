const Message = require("../models/Message");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// Send inquiry message to listing host
const sendMessage = async (req, res) => {
  try {
    const { listingId, content, phone } = req.body;

    if (!listingId || !content) {
      return res.status(400).json({ message: "Listing ID and message content are required." });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const hostId = listing.host;

    const message = await Message.create({
      listing: listing._id,
      sender: req.user.id,
      recipient: hostId,
      senderName: req.user.fullName || "Guest",
      content: content.trim(),
      phone: phone || "",
    });

    // Notify the host
    try {
      await Notification.create({
        recipient: hostId,
        sender: req.user.id,
        title: "New Message from Guest 💬",
        message: `${req.user.fullName || "A guest"} sent an inquiry regarding "${listing.title}": "${content.slice(0, 60)}..."`,
        type: "message",
        link: `/listing/${listing._id}`,
      });
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Message sent to host successfully! ✉️",
      sentMessage: message,
    });
  } catch (error) {
    console.error("SEND_MESSAGE ERROR:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};

// Get messages for a listing
const getListingMessages = async (req, res) => {
  try {
    const { listingId } = req.params;

    const messages = await Message.find({
      listing: listingId,
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .populate("sender", "fullName avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("GET_MESSAGES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch messages." });
  }
};

module.exports = {
  sendMessage,
  getListingMessages,
};
