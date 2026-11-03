import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { listingsAPI, aiAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Sparkles, Image, Check, Plus, ArrowRight } from "lucide-react";

const HostListing = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Student PG / Hostel");
  const [location, setLocation] = useState("");
  const [mapLocation, setMapLocation] = useState("");
  const [price, setPrice] = useState("");
  const [pricePeriod, setPricePeriod] = useState("month");
  const [roomType, setRoomType] = useState("Private Room");
  const [guests, setGuests] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [available, setAvailable] = useState(true);
  const [amenities, setAmenities] = useState(["WiFi", "Security"]);

  const [loading, setLoading] = useState(false);
  const [aiPriceLoading, setAiPriceLoading] = useState(false);
  const [aiPriceInsight, setAiPriceInsight] = useState(null);

  const availableAmenities = [
    "WiFi",
    "AC",
    "Parking",
    "Security",
    "Kitchen",
    "TV",
    "Breakfast",
    "Laundry",
    "Study Table",
    "CCTV",
    "Mess",
    "Washing Machine",
  ];

  const handleAmenityChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Price Advisor
  const handleAIPriceEstimate = async () => {
    if (!category || !location) {
      showToast("Please enter category and location first for accurate AI pricing.", "warning");
      return;
    }

    setAiPriceLoading(true);
    try {
      const data = await aiAPI.priceAdvisor({
        category,
        location,
        roomType,
        amenities,
      });

      if (data.suggestedPrice) {
        const periodUnit =
          category === "Tourist Stay"
            ? "/ night"
            : category === "Parking Space"
            ? "/ hour"
            : category === "Short Stay"
            ? "/ 4 hours"
            : "/ month";

        setPrice(`₹${data.suggestedPrice} ${periodUnit}`);
        setAiPriceInsight(data);
        showToast(`AI suggested ₹${data.suggestedPrice} ${periodUnit}! ✨`, "success");
      }
    } catch (err) {
      showToast("AI Price Advisor currently unavailable.", "error");
    } finally {
      setAiPriceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !price || !description) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const mainImage =
        imagePreview ||
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800";

      const payload = {
        title: title.trim(),
        category,
        location: location.trim(),
        mapLocation: mapLocation.trim() || location.trim(),
        price: price.trim(),
        pricePeriod,
        roomType,
        guests: Number(guests) || 1,
        bathrooms: Number(bathrooms) || 1,
        amenities,
        description: description.trim(),
        image: mainImage,
        images: [mainImage],
        available,
        badge: "New",
      };

      await listingsAPI.create(payload);

      showToast("Property listing created successfully! 🎉", "success");
      setTimeout(() => {
        navigate("/mylistings");
      }, 1000);
    } catch (err) {
      showToast(err.message || "Failed to create listing.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent">
              List Your Property
            </h1>
            <p className="text-gray-500 mt-2 text-base md:text-lg">
              Reach thousands of students, travellers, and daily guests on StayEase+.
            </p>
          </div>

          {/* Listing Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 space-y-8"
          >
            {/* Section 1: Property Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                1. Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cozy Student PG near BHU Gate"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm bg-white"
                    >
                      <option value="Student PG / Hostel">Student PG / Hostel</option>
                      <option value="Tourist Stay">Tourist Stay</option>
                      <option value="Coaching Stay">Coaching Stay</option>
                      <option value="Short Stay">Short Stay</option>
                      <option value="Parking Space">Parking Space</option>
                      <option value="Monthly Rooms">Monthly Rooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Location / City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lanka, Varanasi or Rajeev Nagar, Kota"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & AI Price Advisor */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                <h2 className="text-xl font-bold text-gray-900">2. Rental Pricing</h2>
                <button
                  type="button"
                  onClick={handleAIPriceEstimate}
                  disabled={aiPriceLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C5CE7] hover:text-[#5848c2] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiPriceLoading ? "Calculating..." : "✨ AI Price Suggestion"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Price with Unit *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5500 / month"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Billing Period
                  </label>
                  <select
                    value={pricePeriod}
                    onChange={(e) => setPricePeriod(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm bg-white"
                  >
                    <option value="month">Per Month</option>
                    <option value="night">Per Night</option>
                    <option value="hour">Per Hour</option>
                    <option value="4 hours">Per 4 Hours</option>
                  </select>
                </div>
              </div>

              {aiPriceInsight && (
                <div className="mt-3 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                  <span>💡 {aiPriceInsight.insights}</span>
                  <span className="font-bold text-[#6C5CE7]">
                    Fair range: ₹{aiPriceInsight.priceRange?.min} – ₹{aiPriceInsight.priceRange?.max}
                  </span>
                </div>
              )}
            </div>

            {/* Section 3: Room Specifications */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                3. Room Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm bg-white"
                  >
                    <option value="Single Room">Single Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Covered Parking">Covered Parking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Amenities */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">
                4. Amenities & Facilities
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Check all amenities available to guests at your property.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition text-xs font-semibold ${
                      amenities.includes(amenity)
                        ? "bg-[#6C5CE7]/10 border-[#6C5CE7] text-[#6C5CE7]"
                        : "hover:bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="accent-[#6C5CE7] w-4 h-4 rounded"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 5: Description & Photos */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                5. Description & Photos
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Description *
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe your accommodation, surroundings, distance to transit/colleges, rules..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Image URL (Unsplash or direct image link)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Or Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#6C5CE7]/10 file:text-[#6C5CE7] hover:file:bg-[#6C5CE7]/20"
                    />
                  </div>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Property Preview"
                      className="w-full h-48 object-cover rounded-2xl shadow-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-5 h-5 accent-[#6C5CE7] rounded"
                />
                <span className="font-bold text-sm text-gray-800">
                  This property is currently available for booking
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-base shadow-xl hover:scale-102 active:scale-98 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{loading ? "Publishing Property..." : "Publish Listing on StayEase+"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default HostListing;