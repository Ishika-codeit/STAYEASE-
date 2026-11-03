import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { bookingsAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  Calendar,
  MapPin,
  Eye,
  XCircle,
  CreditCard,
  Phone,
  Sparkles,
} from "lucide-react";

const MyBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getMyBookings();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.warn("Failed to fetch bookings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingsAPI.updateStatus(id, "Cancelled");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
      );
      showToast("Booking cancelled successfully.", "info");
    } catch (err) {
      showToast(err.message || "Failed to cancel booking.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              My Reservations & Stays
            </h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              View your booking status, confirmed check-ins, and receipts.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-44 animate-pulse p-6 border" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto border border-gray-100">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#6C5CE7] mx-auto flex items-center justify-center text-3xl mb-4">
                📅
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
              <p className="text-gray-500 text-sm mb-6">
                Find a comfortable stay and reserve with instant verification.
              </p>
              <Link
                to="/search"
                className="inline-block px-6 py-3 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-sm shadow-md"
              >
                Explore Stays
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const listingId = booking.listing?._id || booking.listing;
                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Thumbnail */}
                    <img
                      src={
                        booking.listingImage ||
                        booking.listing?.image ||
                        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500"
                      }
                      alt={booking.listingTitle}
                      className="w-full md:w-64 h-52 object-cover shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                booking.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : booking.status === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              ✓ {booking.status}
                            </span>

                            <span className="text-xs text-gray-500">
                              Payment:{" "}
                              <strong
                                className={
                                  booking.paymentStatus === "Paid"
                                    ? "text-emerald-600 font-bold"
                                    : "text-amber-600"
                                }
                              >
                                {booking.paymentStatus}
                              </strong>
                            </span>
                          </div>

                          <span className="text-xl font-extrabold text-[#6C5CE7]">
                            ₹{booking.totalAmount || booking.price}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mt-2">
                          {booking.listingTitle}
                        </h3>

                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#00CEC9]" />
                          <span>{booking.location}</span>
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
                          <div>
                            <span className="text-gray-400 block font-medium">Check-In</span>
                            <span className="font-bold text-gray-800">
                              {new Date(booking.checkInDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <span className="text-gray-400 block font-medium">Guests</span>
                            <span className="font-bold text-gray-800">
                              {booking.guests} {booking.guests > 1 ? "Guests" : "Guest"}
                            </span>
                          </div>

                          <div>
                            <span className="text-gray-400 block font-medium">Host</span>
                            <span className="font-bold text-gray-800">
                              {booking.host?.fullName || "Verified Host"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-6 pt-3 border-t border-gray-100">
                        {listingId && (
                          <Link
                            to={`/listing/${listingId}`}
                            className="px-4 py-2 rounded-xl border border-[#6C5CE7] text-[#6C5CE7] font-bold text-xs hover:bg-[#6C5CE7] hover:text-white transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Space</span>
                          </Link>
                        )}

                        {booking.status !== "Cancelled" && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50 transition"
                          >
                            Cancel Reservation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default MyBookings;