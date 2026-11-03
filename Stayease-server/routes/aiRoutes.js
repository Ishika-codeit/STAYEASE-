const express = require("express");
const router = express.Router();

const {
  getRecommendations,
  smartNaturalSearch,
  aiChat,
  getPriceRecommendation,
  detectSuspiciousListing,
} = require("../controllers/aiController");

router.get("/recommendations", getRecommendations);
router.post("/smart-search", smartNaturalSearch);
router.post("/chat", aiChat);
router.post("/price-advisor", getPriceRecommendation);
router.post("/detect-fraud", detectSuspiciousListing);

module.exports = router;
