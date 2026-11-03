import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapView from "../components/MapView";
import ThreeDRoomViewer from "../components/ThreeDRoomViewer";
import AIChatbot from "../components/AIChatbot";
import ListingCard from "../components/ListingCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { listingsAPI, messagesAPI, aiAPI } from "../services/api";
import staticListing from "../data/listing";
import {
  Star,
  MapPin,
  Check,
  Shield,
  MessageSquare,
  Sparkles,
  Calendar,
  Eye,
  Heart,
  Share2,
  X,
  Send,
  ArrowLeft,
} from "lucide-react";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "3d" | "map"

  // Contact Host Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // AI Similar Recommendations
  const [similarListings, setSimilarListings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const data = await listingsAPI.getById(id);
        if (data.listing) {
          setListing(data.listing);
          setSelectedImage(data.listing.image || (data.listing.images && data.listing.images[0]));

          // Fetch similar recommendations
          aiAPI
            .getRecommendations({
              category: data.listing.category,
              currentListingId: data.listing._id,
            })
            .then((recData) => setSimilarListings(recData.recommendations || []))
            .catch(() => {});
        }
      } catch (err) {
        // Fallback for mock IDs
        const mockItem = staticListing.find((item) => String(item.id) === String(id));
        if (mockItem) {
          setListing(mockItem);
          setSelectedImage(mockItem.image);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleContactHost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please login first to contact the host.", "warning");
      navigate("/login");
      return;
    }

    if (!inquiryMessage.trim()) {
      showToast("Please enter an inquiry message.", "error");
      return;
    }

    setSendingMessage(true);
    try {
      await messagesAPI.send({
        listingId: listing._id || id,
        content: inquiryMessage.trim(),
        phone: guestPhone,
      });

      showToast("Inquiry sent to host successfully! 📬", "success");
      setContactModalOpen(false);
      setInquiryMessage("");
    } catch (err) {
      showToast(err.message || "Failed to send message.", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please login to leave a review.", "warning");
      navigate("/login");
      return;
    }

    if (!reviewComment.trim()) {
      showToast("Please write a short review comment.", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      const data = await listingsAPI.addReview(listing._id || id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      showToast("Review submitted successfully! ⭐", "success");
      setListing((prev) => ({
        ...prev,
        reviews: data.reviews,
        rating: data.rating,
      }));
      setReviewComment("");
    } catch (err) {
      showToast(err.message || "Failed to submit review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <main className="max-w-6xl mx-auto w-full pt-32 pb-16 px-6">
          <div className="h-96 bg-gray-200 rounded-3xl animate-pulse mb-8" />
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 animate-pulse mb-4" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <main className="min-h-[60vh] flex items-center justify-center pt-28 px-6">
          <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Listing Not Found</h1>
            <p className="text-gray-500 mb-6">
              The property you are looking for does not exist or may have been unlisted.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="w-full px-6 py-3.5 rounded-xl text-black font-bold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] shadow-md hover:scale-105 active:scale-95 transition"
            >
              Back to Search
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const galleryImages =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.image];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#6C5CE7] font-bold text-sm hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Listing link copied to clipboard! 📋", "info");
                }}
                className="p-2.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-black transition"
                title="Share Listing"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSaved(!saved);
                  showToast(saved ? "Removed from favorites." : "Added to favorites! ❤️", "success");
                }}
                className="p-2.5 rounded-full bg-white shadow-sm border border-gray-200 transition hover:scale-105"
                title="Save Property"
              >
                <Heart
                  className={`w-4 h-4 ${
                    saved ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Title & Location Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-extrabold uppercase">
                {listing.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                ✓ {listing.available ? "Available Now" : "Unavailable"}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {listing.title}
                </h1>
                <p className="text-gray-500 text-base md:text-lg flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-[#00CEC9]" />
                  <span>{listing.location}</span>
                </p>
              </div>

              <div className="md:text-right">
                <span className="text-xs uppercase tracking-wider text-gray-400 block font-bold">
                  Rental Price
                </span>
                <span className="text-3xl md:text-4xl font-extrabold text-[#6C5CE7]">
                  {listing.price}
                </span>
              </div>
            </div>
          </div>

          {/* Gallery & Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[440px] md:h-[500px] mb-8">
            <div className="md:col-span-3 relative rounded-3xl overflow-hidden shadow-xl bg-gray-900 group">
              <img
                src={selectedImage || listing.image}
                alt={listing.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute top-5 left-5 bg-black/60 backdrop-blur-md text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg">
                {listing.badge || "Verified"}
              </span>
            </div>

            {/* Thumbnail Selectors */}
            <div className="hidden md:flex flex-col gap-4 overflow-y-auto">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 transition shadow-md ${
                    selectedImage === img
                      ? "border-[#00CEC9] scale-102"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* View Mode Tabs (Overview vs 3D Tour vs Map) */}
          <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === "overview"
                  ? "bg-[#6C5CE7] text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              Overview & Amenities
            </button>

            <button
              onClick={() => setActiveTab("3d")}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === "3d"
                  ? "bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              <span>3D Virtual Tour</span>
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                activeTab === "map"
                  ? "bg-[#00CEC9] text-black shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Location Map</span>
            </button>
          </div>

          {/* Tab 1: 3D Room Viewer */}
          {activeTab === "3d" && (
            <div className="mb-10">
              <ThreeDRoomViewer title={listing.title} />
            </div>
          )}

          {/* Tab 2: Map & Landmarks */}
          {activeTab === "map" && (
            <div className="mb-10">
              <MapView
                location={listing.location}
                mapLocation={listing.mapLocation}
                coordinates={listing.coordinates}
                title={listing.title}
              />
            </div>
          )}

          {/* Main Content Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Details, Amenities, Reviews */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About this Space</h3>
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>

                {/* Key Room Specs */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-center">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-bold uppercase">Room Type</p>
                    <p className="font-extrabold text-gray-900 mt-1">{listing.roomType}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-bold uppercase">Guests</p>
                    <p className="font-extrabold text-gray-900 mt-1">
                      {listing.guests} {listing.guests > 1 ? "Guests" : "Guest"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-400 font-bold uppercase">Bathrooms</p>
                    <p className="font-extrabold text-gray-900 mt-1">
                      {listing.bathrooms} {listing.bathrooms === 1 ? "Bath" : "Baths"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listing.amenities?.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-semibold text-gray-800"
                    >
                      <Check className="w-4 h-4 text-[#00CEC9] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {listing.rating} • {listing.reviews?.length || 0} Reviews
                    </h3>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {listing.reviews && listing.reviews.length > 0 ? (
                    listing.reviews.map((rev, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-sm text-gray-900">{rev.name}</p>
                          <div className="flex text-yellow-400 text-xs">
                            {"★".repeat(rev.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic col-span-2">
                      No reviews yet. Be the first to review this space!
                    </p>
                  )}
                </div>

                {/* Add Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="pt-6 border-t border-gray-100 space-y-4"
                >
                  <h4 className="font-bold text-base text-gray-900">Leave a Review</h4>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-xl transition ${
                          star <= reviewRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows="3"
                    placeholder="Share your experience staying here..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition disabled:opacity-60"
                  >
                    {submittingReview ? "Submitting..." : "Post Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right 1 Col: Host Card & Booking Action Box */}
            <div className="space-y-6">
              {/* Sticky Booking Action Card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#6C5CE7]/30 sticky top-28 space-y-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#6C5CE7]">
                    {listing.price}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Verified Rate
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Availability</span>
                    <span className="font-bold text-green-600">
                      {listing.available ? "Instant Booking" : "Full"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation</span>
                    <span className="font-semibold text-gray-800">Free within 24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Host Response</span>
                    <span className="font-semibold text-gray-800">Under 1 hour</span>
                  </div>
                </div>

                <button
                  disabled={!listing.available}
                  onClick={() => navigate(`/booking/${listing._id || listing.id}`)}
                  className="w-full py-4 rounded-2xl text-black font-extrabold text-base bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] shadow-xl hover:scale-102 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {listing.available ? "Book This Stay" : "Currently Unavailable"}
                </button>

                <button
                  onClick={() => setContactModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl border-2 border-[#6C5CE7] text-[#6C5CE7] font-bold text-sm hover:bg-[#6C5CE7] hover:text-white transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Host</span>
                </button>
              </div>

              {/* Host Profile Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h4 className="font-bold text-base text-gray-900 mb-4">About the Host</h4>
                <div className="flex items-center gap-4">
                  {listing.host?.avatar ? (
                    <img
                      src={listing.host.avatar}
                      alt={listing.host.fullName || "Host"}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#00CEC9]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                      {listing.host?.name?.charAt(0) ||
                        listing.host?.fullName?.charAt(0) ||
                        "H"}
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-base text-gray-900">
                      {listing.host?.name || listing.host?.fullName || "Verified Host"}
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Verified StayEase+ Host</span>
                    </p>
                  </div>
                </div>

                {listing.host?.bio && (
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed border-t border-gray-100 pt-3">
                    "{listing.host.bio}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommended Similar Listings */}
          {similarListings.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-8">
                <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="text-2xl font-extrabold text-gray-900">
                  AI Recommended Similar Stays
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarListings.slice(0, 3).map((item) => (
                  <ListingCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    _id={item._id}
                    image={item.image}
                    badge={item.badge}
                    title={item.title}
                    price={item.price}
                    location={item.location}
                    rating={item.rating}
                    category={item.category}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Contact Host Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-200 relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6C5CE7] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contact Host</h3>
                <p className="text-xs text-gray-500">
                  Direct inquiry for "{listing.title}"
                </p>
              </div>
            </div>

            <form onSubmit={handleContactHost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Your Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Message / Questions
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Hi! I am interested in this accommodation. Can you share details about the mess timings and move-in date?"
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              <button
                type="submit"
                disabled={sendingMessage}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-sm shadow-md hover:scale-102 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{sendingMessage ? "Sending..." : "Send Message to Host"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default ListingDetails;