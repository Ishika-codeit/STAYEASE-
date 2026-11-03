const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

// Import Routes
const authroutes = require("./routes/authroutes");
const listingRoutes = require("./routes/listingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Security & Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

app.use(limiter);

// Configure CORS
app.use(
  cors({
    origin: "*", // Allow all origins for dev / production flexibility
    credentials: true,
  })
);

// Body Parsers (allow up to 10mb for base64 / data uri images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authroutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// Base Health Check
app.get("/", (req, res) => {
  res.json({
    name: "StayEase+ API",
    status: "Healthy 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Centralized 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("GLOBAL SERVER ERROR:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error.",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StayEase+ Server running on port ${PORT} 🚀`);
});