const Notification = require("../models/Notification");

// Get notifications for authenticated user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("GET_NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

// Mark single notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("MARK_READ ERROR:", error);
    res.status(500).json({ message: "Failed to update notification." });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("MARK_ALL_READ ERROR:", error);
    res.status(500).json({ message: "Failed to mark notifications." });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
