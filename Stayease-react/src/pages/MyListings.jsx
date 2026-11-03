import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { listingsAPI, bookingsAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  Home,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Sliders,
  Sparkles,
} from "lucide-react";

const MyListings = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("listings"); // "listings" | "bookings"
  const [listings, setListings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch host listings and received bookings
  const loadHostData = async () => {
    setLoading(true);
    try {
      const [listingsRes, bookingsRes] = await Promise.allSettled([
        listingsAPI.getMyListings(),
        bookingsAPI.getHostReceived(),
      ]);

      if (listingsRes.status === "fulfilled" && listingsRes.value.listings) {
        setListings(listingsRes.value.listings);
      }
      if (bookingsRes.status === "fulfilled" && bookingsRes.value.bookings) {
        setReceivedBookings(bookingsRes.value.bookings);
      }
    } catch (err) {
      console.warn("Error loading host data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostData();
  }, []);

  // Handle Delete
  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }

    try {
      await listingsAPI.delete(id);
      setListings((prev) => prev.filter((item) => (item._id || item.id) !== id));
      showToast("Listing deleted successfully 🗑️", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete listing.", "error");
    }
  };

  // Toggle Availability
  const handleToggleAvailability = async (id) => {
    try {
      const data = await listingsAPI.toggleAvailability(id);
      setListings((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, available: data.available } : item
        )
      );
      showToast(data.message, "success");
    } catch (err) {
      showToast("Failed to toggle availability.", "error");
    }
  };

  // Handle Booking Status (Confirm / Reject / Complete)
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status);
      setReceivedBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
      showToast(`Booking marked as ${status} ✅`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update booking status.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Host Management Dashboard
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                Manage your properties, availability, and guest reservations.
              </p>
            </div>

            <Link
              to="/hostlisting"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>List New Property</span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === "listings"
                  ? "bg-[#6C5CE7] text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>My Properties ({listings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === "bookings"
                  ? "bg-[#00CEC9] text-black shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Received Bookings ({receivedBookings.length})</span>
            </button>
          </div>

          {/* Tab 1: Listings */}
          {activeTab === "listings" && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border" />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto border border-gray-100">
                  <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#6C5CE7] mx-auto flex items-center justify-center text-3xl mb-4">
                    🏠
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Properties Listed Yet</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Start hosting your space to reach hundreds of students and travellers.
                  </p>
                  <Link
                    to="/hostlisting"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold text-sm shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Listing</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-[#6C5CE7] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {item.category}
                        </span>

                        <span
                          className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                            item.available
                              ? "bg-emerald-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1">📍 {item.location}</p>
                          <p className="text-base font-extrabold text-[#6C5CE7] mt-3">
                            {item.price}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
                          {/* Availability Toggle Switch */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600">
                              Accept New Bookings
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(item._id || item.id)}
                              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                                item.available ? "bg-[#00CEC9]" : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                                  item.available ? "translate-x-6" : ""
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/listing/${item._id || item.id}`}
                              className="flex-1 py-2 rounded-xl border border-[#6C5CE7] text-[#6C5CE7] font-bold text-xs text-center hover:bg-[#6C5CE7] hover:text-white transition flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>

                            <button
                              onClick={() => handleDeleteListing(item._id || item.id)}
                              className="py-2 px-3 rounded-xl border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab 2: Received Bookings */}
          {activeTab === "bookings" && (
            <>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-white rounded-3xl h-40 animate-pulse border" />
                  ))}
                </div>
              ) : receivedBookings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto border border-gray-100">
                  <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#00CEC9] mx-auto flex items-center justify-center text-3xl mb-4">
                    📅
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Received Yet</h2>
                  <p className="text-gray-500 text-sm">
                    When guests book your accommodations, their requests will appear here for you to accept or manage.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedBookings.map((b) => (
                    <div
                      key={b._id}
                      className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={b.listingImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"}
                          alt=""
                          className="w-24 h-24 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : b.status === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {b.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              • Payment: <strong className="text-gray-700">{b.paymentStatus}</strong>
                            </span>
                          </div>

                          <h3 className="font-bold text-lg text-gray-900 mt-1">{b.listingTitle}</h3>

                          {/* Guest details */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
                            <span className="flex items-center gap-1 font-semibold">
                              <User className="w-3.5 h-3.5 text-purple-600" />
                              {b.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {b.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              Check-in: {new Date(b.checkInDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Host Actions */}
                      <div className="flex flex-col md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <span className="text-2xl font-extrabold text-[#6C5CE7]">
                          ₹{b.totalAmount || b.price}
                        </span>

                        <div className="flex items-center gap-2">
                          {b.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id, "Confirmed")}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>

                              <button
                                onClick={() => handleUpdateBookingStatus(b._id, "Rejected")}
                                className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-bold text-xs hover:bg-red-200 transition flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {b.status === "Confirmed" && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, "Completed")}
                              className="px-4 py-2 rounded-xl bg-purple-100 text-[#6C5CE7] font-bold text-xs hover:bg-purple-200 transition"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default MyListings;