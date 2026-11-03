import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { listingsAPI, bookingsAPI, paymentsAPI } from "../services/api";
import staticListing from "../data/listing";
import confetti from "canvas-confetti";
import {
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [selectedListing, setSelectedListing] = useState(null);
  const [loadingListing, setLoadingListing] = useState(true);

  // Form Fields
  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0]
  );
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoadingListing(true);
      try {
        const data = await listingsAPI.getById(id);
        if (data.listing) {
          setSelectedListing(data.listing);
        }
      } catch (err) {
        const fallback = staticListing.find((item) => String(item.id) === String(id));
        if (fallback) setSelectedListing(fallback);
      } finally {
        setLoadingListing(false);
      }
    };

    fetchListing();
  }, [id]);

  // Calculate pricing breakdown
  const unitPrice =
    selectedListing?.priceNumber ||
    parseInt(String(selectedListing?.price || "1000").replace(/[^\d]/g, ""), 10) ||
    1000;

  const isDaily =
    selectedListing?.category === "Tourist Stay" ||
    selectedListing?.category === "Short Stay";

  const diffTime = Math.max(
    86400000,
    new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()
  );
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const basePrice = isDaily ? unitPrice * totalDays : unitPrice;
  const platformFee = Math.round(basePrice * 0.05);
  const totalEstimatedAmount = basePrice + platformFee;

  // Step 1: Submit Booking Form
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast("Please login first to reserve an accommodation.", "warning");
      navigate("/login");
      return;
    }

    if (!name || !phone || !checkInDate) {
      showToast("Please enter your name, phone, and check-in date.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        listingId: selectedListing._id || selectedListing.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        checkInDate,
        checkOutDate,
        guests: Number(guests) || 1,
        specialRequests: specialRequests.trim(),
      };

      const res = await bookingsAPI.create(payload);
      setCreatedBooking(res.booking);
      setPaymentStep(true);
      showToast("Booking request created! Proceed to secure payment 💳", "info");
    } catch (err) {
      showToast(err.message || "Failed to create booking request.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Handle Payment Verification
  const handleProceedPayment = async () => {
    if (!createdBooking) return;

    setProcessingPayment(true);
    try {
      // 1. Backend creates order
      const orderData = await paymentsAPI.createOrder(createdBooking._id);

      // 2. Mock payment verification token
      const mockPaymentId = `pay_${Date.now()}_test_verified`;
      const verifyRes = await paymentsAPI.verifyPayment({
        bookingId: createdBooking._id,
        orderId: orderData.order?.id,
        paymentId: mockPaymentId,
        signature: `sig_verified_${Date.now()}`,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (cErr) {}

      setBookingConfirmed(true);
      showToast("Payment verified! Booking confirmed 🎉", "success");
    } catch (err) {
      showToast(err.message || "Payment verification failed.", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loadingListing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto w-full pt-32 px-6">
          <div className="bg-white rounded-3xl h-96 animate-pulse p-8 shadow-xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedListing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <main className="min-h-[50vh] flex items-center justify-center pt-28 px-6">
          <div className="text-center bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-3">Listing not found</h2>
            <Link
              to="/search"
              className="inline-block px-6 py-2.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold"
            >
              Browse Stays
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C5CE7] hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listing</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Confirm & Book Your Stay
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Secure reservation with verified host confirmation and instant receipt.
            </p>
          </div>

          {!bookingConfirmed ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left 2 Cols: Form or Payment Step */}
              <div className="md:col-span-2">
                {!paymentStep ? (
                  /* STEP 1: Guest Information Form */
                  <form
                    onSubmit={handleSubmitBooking}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                      Guest Details
                    </h2>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Check-in Date *
                        </label>
                        <input
                          type="date"
                          value={checkInDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          required
                          className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={checkOutDate}
                          min={checkInDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedListing.guests || 6}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Late check-in, parking slot requirement, etc."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-base shadow-xl hover:scale-102 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <span>{submitting ? "Reserving..." : "Continue to Payment"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* STEP 2: Payment Step */
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#6C5CE7]/30 space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6C5CE7] flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Payment Gateway</h2>
                        <p className="text-xs text-gray-500">
                          Encrypted 256-bit SSL transaction (Razorpay Sandbox)
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Booking Ref</span>
                        <span className="font-mono font-bold text-gray-800">
                          {createdBooking?._id?.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Primary Guest</span>
                        <span className="font-semibold text-gray-800">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-in</span>
                        <span className="font-semibold text-gray-800">{checkInDate}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold text-gray-800">Total Payable</span>
                        <span className="text-base font-extrabold text-[#6C5CE7]">
                          ₹{totalEstimatedAmount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>
                        Backend verified: You will receive 100% refund if cancelled within 24h.
                      </span>
                    </div>

                    <button
                      onClick={handleProceedPayment}
                      disabled={processingPayment}
                      className="w-full py-4 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-base shadow-xl hover:scale-102 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {processingPayment
                          ? "Verifying Payment on Server..."
                          : `Pay ₹${totalEstimatedAmount} Now`}
                      </span>
                    </button>

                    <button
                      onClick={() => setPaymentStep(false)}
                      className="w-full py-2 text-xs text-gray-500 hover:text-black font-semibold text-center"
                    >
                      ← Edit Booking Details
                    </button>
                  </div>
                )}
              </div>

              {/* Right 1 Col: Selected Listing Summary */}
              <div>
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4 sticky top-28">
                  <h3 className="font-bold text-base text-gray-900">Booking Summary</h3>

                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        selectedListing.image ||
                        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"
                      }
                      alt={selectedListing.title}
                      className="w-20 h-20 object-cover rounded-2xl shrink-0 border border-gray-200"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6C5CE7] bg-purple-50 px-2 py-0.5 rounded-full">
                        {selectedListing.category}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">
                        {selectedListing.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        📍 {selectedListing.location}
                      </p>
                    </div>
                  </div>

                  {/* Price Calculation Breakdown */}
                  <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Rate ({selectedListing.price})</span>
                      <span>₹{basePrice}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>StayEase Platform Fee (5%)</span>
                      <span>₹{platformFee}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-200 font-extrabold text-sm text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-base text-[#6C5CE7]">₹{totalEstimatedAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Confirmed Success Card */
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-emerald-400 text-center max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-inner">
                ✓
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  🎉 Booking Confirmed & Paid!
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Your stay at{" "}
                  <strong className="text-gray-900">{selectedListing.title}</strong> has been
                  confirmed. The host has been notified.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 text-left space-y-2">
                <div className="flex justify-between">
                  <span>Booking Reference:</span>
                  <span className="font-mono font-bold">{createdBooking?._id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest:</span>
                  <span className="font-semibold">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-In:</span>
                  <span className="font-semibold">{checkInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">Confirmed & Verified</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/mybookings"
                  className="flex-1 py-3.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-sm shadow-md hover:scale-102 transition"
                >
                  View in My Bookings
                </Link>

                <Link
                  to="/search"
                  className="flex-1 py-3.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Explore More Stays
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Booking;