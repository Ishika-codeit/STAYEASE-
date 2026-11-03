const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body || {};

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields (full name, email, phone, password) are required.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: role && ["guest", "host", "admin"].includes(role) ? role : "guest",
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "stayease_super_secret_key_2026",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Account created successfully 🎉",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        city: user.city || "",
        isVerified: user.isVerified || false,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({
      message: error.message || "Failed to create account.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Role check: only if a specific role is passed and user isn't admin
    if (role && user.role !== "admin" && user.role !== role) {
      return res.status(401).json({
        message: `This account is registered as ${user.role}. Please select ${user.role} to login.`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "stayease_super_secret_key_2026",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful ✨",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        city: user.city || "",
        isVerified: user.isVerified || false,
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error during login.",
    });
  }
};

// Get current logged-in user profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        city: user.city || "",
        isVerified: user.isVerified || false,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GET_ME ERROR:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, bio, city, avatar, role } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio;
    if (city !== undefined) user.city = city;
    if (avatar !== undefined) user.avatar = avatar;
    if (role && ["guest", "host"].includes(role) && user.role !== "admin") {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully ✅",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        city: user.city || "",
        isVerified: user.isVerified || false,
      },
    });
  } catch (error) {
    console.error("UPDATE_PROFILE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update profile." });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully 🔒" });
  } catch (error) {
    console.error("CHANGE_PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to change password." });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
};