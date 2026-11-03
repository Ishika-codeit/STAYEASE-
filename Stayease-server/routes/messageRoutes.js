const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getListingMessages,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authmiddleware");

router.use(protect);

router.post("/inquire", sendMessage);
router.get("/:listingId", getListingMessages);

module.exports = router;
