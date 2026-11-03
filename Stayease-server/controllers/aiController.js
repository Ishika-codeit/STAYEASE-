const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// 1. AI-based accommodation recommendations
const getRecommendations = async (req, res) => {
  try {
    const { category, currentListingId, maxPrice } = req.query;
    let query = { status: "approved", available: true };

    if (currentListingId) {
      query._id = { $ne: currentListingId };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (maxPrice) {
      query.priceNumber = { $lte: Number(maxPrice) };
    }

    // Fetch listings sorted by rating and review count
    let recommendations = await Listing.find(query)
      .populate("host", "fullName isVerified avatar")
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    // If few found with strict category, broaden search
    if (recommendations.length < 3) {
      const more = await Listing.find({
        status: "approved",
        available: true,
        _id: { $nin: recommendations.map((r) => r._id) },
      })
        .populate("host", "fullName isVerified avatar")
        .sort({ rating: -1 })
        .limit(6 - recommendations.length);

      recommendations = [...recommendations, ...more];
    }

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("AI_RECOMMENDATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to generate recommendations." });
  }
};

// 2. Smart Natural Language Search
const smartNaturalSearch = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ message: "Please provide a search prompt." });
    }

    const text = prompt.toLowerCase();
    const query = { status: "approved" };
    const detectedCriteria = {};

    // 1. Detect Category
    if (text.includes("pg") || text.includes("hostel") || text.includes("student")) {
      query.category = "Student PG / Hostel";
      detectedCriteria.category = "Student PG / Hostel";
    } else if (text.includes("tourist") || text.includes("hotel") || text.includes("resort") || text.includes("vacation")) {
      query.category = "Tourist Stay";
      detectedCriteria.category = "Tourist Stay";
    } else if (text.includes("coaching") || text.includes("allen") || text.includes("neet") || text.includes("jee")) {
      query.category = "Coaching Stay";
      detectedCriteria.category = "Coaching Stay";
    } else if (text.includes("parking") || text.includes("car") || text.includes("vehicle") || text.includes("garage")) {
      query.category = "Parking Space";
      detectedCriteria.category = "Parking Space";
    } else if (text.includes("short") || text.includes("hour") || text.includes("day stay")) {
      query.category = "Short Stay";
      detectedCriteria.category = "Short Stay";
    } else if (text.includes("month") || text.includes("monthly") || text.includes("flat") || text.includes("apartment")) {
      query.category = "Monthly Rooms";
      detectedCriteria.category = "Monthly Rooms";
    }

    // 2. Detect Locations
    const cities = [
      "varanasi",
      "bhu",
      "jaipur",
      "delhi",
      "lucknow",
      "kota",
      "prayagraj",
      "allahabad",
      "bareilly",
      "kanpur",
    ];

    for (const city of cities) {
      if (text.includes(city)) {
        query.location = { $regex: city, $options: "i" };
        detectedCriteria.location = city.toUpperCase();
        break;
      }
    }

    // 3. Detect Budget (e.g., "under 5000", "below 8000", "< 1000")
    const underMatch = text.match(/(?:under|below|less than|within|budget of|<)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (underMatch) {
      const maxP = parseInt(underMatch[1], 10);
      query.priceNumber = { $lte: maxP };
      detectedCriteria.maxPrice = `₹${maxP}`;
    }

    // 4. Detect Amenities
    const amenitiesToDetect = ["wifi", "ac", "parking", "kitchen", "study table", "cctv", "mess", "tv"];
    const foundAmenities = [];
    for (const am of amenitiesToDetect) {
      if (text.includes(am)) {
        foundAmenities.push(new RegExp(am, "i"));
      }
    }
    if (foundAmenities.length > 0) {
      query.amenities = { $in: foundAmenities };
      detectedCriteria.amenities = foundAmenities.map((a) => a.source.toUpperCase());
    }

    const listings = await Listing.find(query)
      .populate("host", "fullName isVerified avatar")
      .limit(15);

    res.status(200).json({
      success: true,
      originalPrompt: prompt,
      detectedCriteria,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("AI_SMART_SEARCH ERROR:", error);
    res.status(500).json({ message: "Failed to process smart search." });
  }
};

// 3. AI Chatbot for Accommodation Queries
const aiChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    const text = message.toLowerCase();

    // Query listings from DB to inject real recommendations into AI response
    let relevantListings = [];
    if (text.includes("pg") || text.includes("student") || text.includes("bhu") || text.includes("kota")) {
      relevantListings = await Listing.find({
        category: { $in: ["Student PG / Hostel", "Coaching Stay"] },
        status: "approved",
      }).limit(2);
    } else if (text.includes("jaipur") || text.includes("tourist") || text.includes("travel")) {
      relevantListings = await Listing.find({
        category: "Tourist Stay",
        status: "approved",
      }).limit(2);
    } else if (text.includes("parking")) {
      relevantListings = await Listing.find({
        category: "Parking Space",
        status: "approved",
      }).limit(2);
    } else {
      relevantListings = await Listing.find({ status: "approved" }).sort({ rating: -1 }).limit(2);
    }

    let responseText = "";

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      responseText = `Hello! 👋 I'm **StayEase AI Concierge**, your personal accommodation assistant.

I can help you:
- 🎓 Find student PGs & coaching stays (Kota, Varanasi, Lucknow, etc.)
- 🏖️ Discover tourist stays & weekend getaways
- 🚗 Book secure 24/7 parking spaces
- 💰 Check fair market rental pricing
- 📋 Learn about booking, verification, and house rules

What kind of stay or city are you looking for today?`;
    } else if (text.includes("pg") || text.includes("hostel") || text.includes("bhu") || text.includes("student")) {
      responseText = `Great choice! For students and college scholars, StayEase+ offers verified PGs with high-speed WiFi, quiet study zones, mess facilities, and 24/7 security.

**Top Recommendations from our verified hosts:**
${relevantListings
  .map(
    (l) =>
      `• **[${l.title}](/listing/${l._id})** in ${l.location} — ${l.price} (★ ${l.rating})`
  )
  .join("\n")}

💡 **Pro Tip**: Look for the **"Verified Host"** badge for properties that have undergone in-person physical checks!`;
    } else if (text.includes("price") || text.includes("cost") || text.includes("cheap") || text.includes("budget")) {
      responseText = `Here is a quick StayEase+ market price guide across India:
- **Student PGs / Hostels**: ₹4,500 – ₹8,500 / month (includes WiFi & study table)
- **Coaching Residence (Kota)**: ₹5,500 – ₹9,500 / month (includes mess & AC)
- **Tourist Stays**: ₹700 – ₹2,500 / night
- **Parking Spaces**: ₹30 – ₹60 / hour or monthly passes
- **Monthly Private Rooms**: ₹6,000 – ₹12,000 / month

Would you like me to filter accommodations for you within a specific budget?`;
    } else if (text.includes("cancel") || text.includes("refund") || text.includes("policy")) {
      responseText = `### 🛡️ StayEase+ Booking & Refund Policy:
1. **Free Cancellation**: Cancel up to 24 hours before your check-in date for a 100% full refund.
2. **Host Review**: If a host does not accept your pending booking within 48 hours, it auto-cancels and no amount is deducted.
3. **Secure Payments**: Payments are held safely until your check-in is validated.`;
    } else if (text.includes("host") || text.includes("list my") || text.includes("earn")) {
      responseText = `### 🏠 Becoming a StayEase+ Host:
1. Navigate to **Host-listing** from the top menu.
2. Fill out your property information, photos, amenities, and rent.
3. Use our **AI Price Advisor** to find the most competitive pricing for your location.
4. Once published, you can manage bookings and accept guest requests from your **Host Dashboard**!`;
    } else {
      responseText = `I'd love to help you find the best stay! Based on what travellers and students usually book on StayEase+:

${relevantListings
  .map(
    (l) =>
      `• **[${l.title}](/listing/${l._id})** (${l.category}) in ${l.location} at **${l.price}**`
  )
  .join("\n")}

Feel free to ask me to search by city, budget (e.g. *"find room under 5000"*), or specific amenities like AC and WiFi!`;
    }

    res.status(200).json({
      success: true,
      reply: responseText,
      suggestedListings: relevantListings,
    });
  } catch (error) {
    console.error("AI_CHAT ERROR:", error);
    res.status(500).json({ message: "AI assistant error." });
  }
};

// 4. Intelligent Price Recommendation for Hosts
const getPriceRecommendation = async (req, res) => {
  try {
    const { category, location, roomType, amenities } = req.body;

    let baseRent = 5000;
    const cat = category || "Student PG / Hostel";
    const loc = (location || "").toLowerCase();

    // City baseline adjustments
    if (loc.includes("delhi") || loc.includes("mumbai") || loc.includes("bangalore")) {
      baseRent += 3000;
    } else if (loc.includes("kota") || loc.includes("jaipur") || loc.includes("lucknow")) {
      baseRent += 1500;
    }

    // Category multipliers
    if (cat === "Tourist Stay") {
      baseRent = 1200; // per night
    } else if (cat === "Parking Space") {
      baseRent = 45; // per hour
    } else if (cat === "Short Stay") {
      baseRent = 500; // per 4 hours
    } else if (cat === "Monthly Rooms") {
      baseRent = 7500;
    }

    // Room type adjustments
    if (roomType === "Deluxe Room" || roomType === "Private Room") {
      baseRent = Math.round(baseRent * 1.25);
    } else if (roomType === "Shared Room" || roomType === "Double Sharing") {
      baseRent = Math.round(baseRent * 0.85);
    }

    // Amenities booster
    const amenityCount = Array.isArray(amenities) ? amenities.length : 0;
    const amenityBonus = cat === "Tourist Stay" ? amenityCount * 80 : amenityCount * 250;

    const recommended = Math.round(baseRent + amenityBonus);
    const minSuggested = Math.round(recommended * 0.85);
    const maxSuggested = Math.round(recommended * 1.2);

    res.status(200).json({
      success: true,
      suggestedPrice: recommended,
      priceRange: {
        min: minSuggested,
        max: maxSuggested,
      },
      insights: `Based on current market demand in ${location || "this area"} for ${cat} with ${amenityCount} amenities.`,
    });
  } catch (error) {
    console.error("PRICE_RECOMMENDATION ERROR:", error);
    res.status(500).json({ message: "Failed to estimate price." });
  }
};

// 5. Fraud / Suspicious Listing Detection
const detectSuspiciousListing = async (req, res) => {
  try {
    const { title, price, category, description, images } = req.body;

    let riskScore = 10;
    const flags = [];

    const numPrice = parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;

    if (category !== "Parking Space" && numPrice < 200) {
      riskScore += 50;
      flags.push("Extremely low price for this category indicates possible scam.");
    }

    if (numPrice > 200000) {
      riskScore += 30;
      flags.push("Price significantly higher than normal market threshold.");
    }

    if (!description || description.length < 20) {
      riskScore += 20;
      flags.push("Vague or insufficient description provided.");
    }

    if (!images || (Array.isArray(images) && images.length === 0)) {
      riskScore += 20;
      flags.push("No property photos attached.");
    }

    const isSuspicious = riskScore >= 50;

    res.status(200).json({
      success: true,
      riskScore: Math.min(riskScore, 100),
      isSuspicious,
      flags,
      recommendation: isSuspicious ? "Review required before publishing" : "Clean listing",
    });
  } catch (error) {
    console.error("FRAUD_DETECTION ERROR:", error);
    res.status(500).json({ message: "Failed to detect fraud." });
  }
};

module.exports = {
  getRecommendations,
  smartNaturalSearch,
  aiChat,
  getPriceRecommendation,
  detectSuspiciousListing,
};
