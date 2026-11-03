const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please login first.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "stayease_super_secret_key_2026"
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    // Admins bypass role restrictions
    if (req.user.role === "admin" || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      message: `Forbidden: You do not have the required role (${roles.join(" or ")}) to access this resource.`,
    });
  };
};

module.exports = { protect, authorize };