const express = require("express");

const router = express.Router();

const authController = require("../controllers/authcontrollers");
const { protect, authorize } = require("../middleware/authmiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/me", protect, authController.getMe);
router.put("/profile", protect, authController.updateProfile);
router.put("/change-password", protect, authController.changePassword);

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated! 🎉",
    user: req.user,
  });
});

router.get("/host-only", protect, authorize("host"), (req, res) => {
  res.status(200).json({
    message: "Welcome, Host! You have access to this exclusive route. 🏠",
    user: req.user,
  });
});

module.exports = router;