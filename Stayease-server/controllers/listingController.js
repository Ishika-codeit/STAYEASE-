const Listing = require("../models/Listing");
const User = require("../models/User");

// Create a new listing (Host / Admin)
const createListing = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      mapLocation,
      price,
      priceNumber,
      pricePeriod,
      roomType,
      guests,
      bathrooms,
      amenities,
      description,
      image,
      images,
      coordinates,
      available,
      badge,
    } = req.body;

    if (!title || !category || !location || !price || !description) {
      return res.status(400).json({
        message: "Title, category, location, price, and description are required.",
      });
    }

    // Parse numeric price if not supplied
    let numericPrice = priceNumber;
    if (!numericPrice) {
      numericPrice = parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;
    }

    // Coordinate defaults for popular cities
    let coords = coordinates;
    if (!coords || !coords.lat) {
      const locLower = (location || "").toLowerCase();
      if (locLower.includes("varanasi") || locLower.includes("bhu")) {
        coords = { lat: 25.3176, lng: 82.9739 };
      } else if (locLower.includes("jaipur")) {
        coords = { lat: 26.9124, lng: 75.7873 };
      } else if (locLower.includes("delhi")) {
        coords = { lat: 28.6139, lng: 77.2090 };
      } else if (locLower.includes("lucknow")) {
        coords = { lat: 26.8467, lng: 80.9462 };
      } else if (locLower.includes("kota")) {
        coords = { lat: 25.2138, lng: 75.8648 };
      } else if (locLower.includes("prayagraj") || locLower.includes("allahabad")) {
        coords = { lat: 25.4358, lng: 81.8463 };
      } else {
        coords = { lat: 25.3176, lng: 82.9739 };
      }
    }

    // Simple AI/Heuristic fraud detection
    let isSuspicious = false;
    let aiRiskScore = 0;
    if (numericPrice < 100 && category !== "Parking Space") {
      isSuspicious = true;
      aiRiskScore = 85;
    } else if (numericPrice > 100000) {
      aiRiskScore = 60;
    }

    const listing = await Listing.create({
      title: title.trim(),
      category,
      location: location.trim(),
      mapLocation: mapLocation ? mapLocation.trim() : location.trim(),
      coordinates: coords,
      price: price.trim(),
      priceNumber: numericPrice,
      pricePeriod: pricePeriod || "month",
      roomType: roomType || "Private Room",
      guests: guests || 1,
      bathrooms: bathrooms !== undefined ? bathrooms : 1,
      amenities: Array.isArray(amenities) ? amenities : [],
      description: description.trim(),
      image: image || "",
      images: Array.isArray(images) && images.length ? images : (image ? [image] : []),
      available: available !== undefined ? available : true,
      badge: badge || "New",
      host: req.user.id,
      isSuspicious,
      aiRiskScore,
      status: isSuspicious ? "flagged" : "approved",
    });

    res.status(201).json({
      message: "Listing created successfully! 🎉",
      listing,
    });
  } catch (error) {
    console.error("CREATE_LISTING ERROR:", error);
    res.status(500).json({
      message: error.message || "Failed to create listing.",
    });
  }
};

// Get all listings with search, filters and sorting
const getAllListings = async (req, res) => {
  try {
    const {
      category,
      location,
      search,
      budget,
      minPrice,
      maxPrice,
      roomType,
      amenity,
      available,
      sort,
      status,
    } = req.query;

    const query = {};

    // Only show approved listings for public unless status specified
    if (status) {
      query.status = status;
    } else {
      query.status = "approved";
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Location / Search keyword
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } else if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Room Type
    if (roomType && roomType !== "All") {
      query.roomType = roomType;
    }

    // Amenity filter (single or comma-separated)
    if (amenity && amenity !== "All") {
      const amenitiesList = amenity.split(",").map((a) => a.trim());
      query.amenities = { $all: amenitiesList };
    }

    // Availability
    if (available !== undefined && available !== "All") {
      query.available = available === "true" || available === true;
    }

    // Budget range handling
    if (budget && budget !== "All") {
      if (budget === "below500") {
        query.priceNumber = { $lt: 500 };
      } else if (budget === "500-1000") {
        query.priceNumber = { $gte: 500, $lte: 1000 };
      } else if (budget === "1000-3000") {
        query.priceNumber = { $gt: 1000, $lte: 3000 };
      } else if (budget === "above3000") {
        query.priceNumber = { $gt: 3000 };
      }
    } else {
      if (minPrice || maxPrice) {
        query.priceNumber = {};
        if (minPrice) query.priceNumber.$gte = Number(minPrice);
        if (maxPrice) query.priceNumber.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { priceNumber: 1 };
    } else if (sort === "price-desc") {
      sortOption = { priceNumber: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const listings = await Listing.find(query)
      .populate("host", "fullName email phone avatar isVerified")
      .sort(sortOption);

    res.status(200).json({
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("GET_ALL_LISTINGS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch listings.",
    });
  }
};

// Get single listing by ID
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "host",
      "fullName email phone avatar isVerified"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.status(200).json({ listing });
  } catch (error) {
    console.error("GET_LISTING_BY_ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch listing." });
  }
};

// Get listings for current authenticated host
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("GET_MY_LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch host listings." });
  }
};

// Update listing (ownership verified)
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Verify ownership or admin
    if (
      listing.host.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only update your own listings.",
      });
    }

    const updatableFields = [
      "title",
      "category",
      "location",
      "mapLocation",
      "price",
      "priceNumber",
      "pricePeriod",
      "roomType",
      "guests",
      "bathrooms",
      "amenities",
      "description",
      "image",
      "images",
      "available",
      "badge",
      "coordinates",
      "status",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    if (req.body.price && !req.body.priceNumber) {
      listing.priceNumber = parseInt(String(req.body.price).replace(/[^\d]/g, ""), 10) || listing.priceNumber;
    }

    await listing.save();

    res.status(200).json({
      message: "Listing updated successfully ✅",
      listing,
    });
  } catch (error) {
    console.error("UPDATE_LISTING ERROR:", error);
    res.status(500).json({ message: "Failed to update listing." });
  }
};

// Delete listing (ownership verified)
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (
      listing.host.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only delete your own listings.",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Listing deleted successfully 🗑️",
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error("DELETE_LISTING ERROR:", error);
    res.status(500).json({ message: "Failed to delete listing." });
  }
};

// Toggle availability
const toggleAvailability = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (
      listing.host.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized." });
    }

    listing.available = !listing.available;
    await listing.save();

    res.status(200).json({
      message: `Listing is now marked as ${listing.available ? "Available" : "Unavailable"}.`,
      available: listing.available,
      listing,
    });
  } catch (error) {
    console.error("TOGGLE_AVAILABILITY ERROR:", error);
    res.status(500).json({ message: "Failed to toggle availability." });
  }
};

// Add review to a listing
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const user = await User.findById(req.user.id);

    const review = {
      name: user ? user.fullName : "Guest",
      rating: Number(rating) || 5,
      comment: comment || "",
      user: req.user.id,
    };

    listing.reviews.push(review);

    // Recalculate average rating
    const totalRating = listing.reviews.reduce((acc, r) => acc + r.rating, 0);
    listing.rating = Number((totalRating / listing.reviews.length).toFixed(1));

    await listing.save();

    res.status(201).json({
      message: "Review added successfully ⭐",
      reviews: listing.reviews,
      rating: listing.rating,
    });
  } catch (error) {
    console.error("ADD_REVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to add review." });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  toggleAvailability,
  addReview,
};
