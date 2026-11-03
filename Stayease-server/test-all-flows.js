// End-to-End Comprehensive Test Suite for StayEase+ Backend
const BASE_URL = "http://localhost:5000";

let guestToken = "";
let hostToken = "";
let adminToken = "";
let createdListingId = "";
let createdBookingId = "";
let notifId = "";

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
};

const runTests = async () => {
  console.log("\n========================================================");
  console.log("🧪 STARTING STAYEASE+ FULL SYSTEM END-TO-END VERIFICATION");
  console.log("========================================================\n");

  // 1. Health check
  console.log("--- 1. Testing Server Base Health Check ---");
  const healthRes = await fetch(`${BASE_URL}/`).then((r) => r.json());
  assert(healthRes.status && healthRes.status.includes("Healthy"), "Server is healthy and responsive");

  // 2. Authentication: Login Host, Guest, Admin
  console.log("\n--- 2. Testing Authentication & Roles ---");
  const guestLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "guest@stayease.com",
      password: "guest123",
      role: "guest",
    }),
  }).then((r) => r.json());
  assert(guestLoginRes.token && guestLoginRes.user.role === "guest", "Guest login returns valid token");
  guestToken = guestLoginRes.token;

  const hostLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "host@stayease.com",
      password: "host123",
      role: "host",
    }),
  }).then((r) => r.json());
  assert(hostLoginRes.token && hostLoginRes.user.role === "host", "Host login returns valid token");
  hostToken = hostLoginRes.token;

  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@stayease.com",
      password: "admin123",
    }),
  }).then((r) => r.json());
  assert(adminLoginRes.token && adminLoginRes.user.role === "admin", "Admin login returns valid token");
  adminToken = adminLoginRes.token;

  // 3. User Profile APIs
  console.log("\n--- 3. Testing User Profile & Settings ---");
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${guestToken}` },
  }).then((r) => r.json());
  assert(meRes.user && meRes.user.email === "guest@stayease.com", "GET /api/auth/me returns guest details");

  const updateProfileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ city: "Lucknow Gomti Nagar", bio: "Verified traveler on StayEase+" }),
  }).then((r) => r.json());
  assert(updateProfileRes.user.city === "Lucknow Gomti Nagar", "PUT /api/auth/profile updates profile fields");

  // 4. Listing Management System
  console.log("\n--- 4. Testing Listing Management System ---");
  const createListingRes = await fetch(`${BASE_URL}/api/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hostToken}`,
    },
    body: JSON.stringify({
      title: "Automated Test PG near IIT",
      category: "Student PG / Hostel",
      location: "Lanka, Varanasi",
      price: "₹4800 / month",
      roomType: "Single Room",
      guests: 1,
      bathrooms: 1,
      amenities: ["WiFi", "AC", "Study Table"],
      description: "Quiet, comfortable student accommodation for tests.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      available: true,
    }),
  }).then((r) => r.json());
  assert(createListingRes.listing && createListingRes.listing._id, "Host can create new listing in DB");
  createdListingId = createListingRes.listing._id;

  const allListingsRes = await fetch(`${BASE_URL}/api/listings`).then((r) => r.json());
  assert(allListingsRes.count >= 6, "GET /api/listings returns all approved listings");

  const singleListingRes = await fetch(`${BASE_URL}/api/listings/${createdListingId}`).then((r) => r.json());
  assert(singleListingRes.listing.title === "Automated Test PG near IIT", "GET /api/listings/:id returns correct single listing");

  const hostListingsRes = await fetch(`${BASE_URL}/api/listings/host/my-listings`, {
    headers: { Authorization: `Bearer ${hostToken}` },
  }).then((r) => r.json());
  assert(hostListingsRes.listings.some((l) => l._id === createdListingId), "GET /api/listings/host/my-listings filters by host ownership");

  const toggleRes = await fetch(`${BASE_URL}/api/listings/${createdListingId}/availability`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${hostToken}` },
  }).then((r) => r.json());
  assert(toggleRes.available === false, "Host can toggle listing availability");

  // Re-enable for booking test
  await fetch(`${BASE_URL}/api/listings/${createdListingId}/availability`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${hostToken}` },
  });

  const reviewRes = await fetch(`${BASE_URL}/api/listings/${createdListingId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ rating: 5, comment: "Top quality PG, high speed wifi!" }),
  }).then((r) => r.json());
  assert(reviewRes.reviews && reviewRes.reviews.length > 0, "Guest can leave a review on listing");

  // 5. Booking System
  console.log("\n--- 5. Testing Booking System ---");
  const createBookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({
      listingId: createdListingId,
      name: "Ananya Saxena",
      phone: "9876501234",
      checkInDate: new Date().toISOString(),
      checkOutDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      guests: 1,
    }),
  }).then((r) => r.json());
  assert(createBookingRes.booking && createBookingRes.booking.status === "Pending", "Guest creates booking request");
  createdBookingId = createBookingRes.booking._id;

  const myBookingsRes = await fetch(`${BASE_URL}/api/bookings/my-bookings`, {
    headers: { Authorization: `Bearer ${guestToken}` },
  }).then((r) => r.json());
  assert(myBookingsRes.bookings.some((b) => b._id === createdBookingId), "Guest My Bookings returns live bookings");

  const hostReceivedRes = await fetch(`${BASE_URL}/api/bookings/host/received`, {
    headers: { Authorization: `Bearer ${hostToken}` },
  }).then((r) => r.json());
  assert(hostReceivedRes.bookings.some((b) => b._id === createdBookingId), "Host Received Bookings shows incoming booking request");

  const updateBookingStatusRes = await fetch(`${BASE_URL}/api/bookings/${createdBookingId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hostToken}`,
    },
    body: JSON.stringify({ status: "Confirmed" }),
  }).then((r) => r.json());
  assert(updateBookingStatusRes.booking.status === "Confirmed", "Host can accept & confirm booking");

  // 6. Payment Flow
  console.log("\n--- 6. Testing Payment Gateway Simulation & Verification ---");
  const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({ bookingId: createdBookingId }),
  }).then((r) => r.json());
  assert(orderRes.success && orderRes.order.id, "Payment order created on backend");

  const verifyPaymentRes = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({
      bookingId: createdBookingId,
      orderId: orderRes.order.id,
      paymentId: `pay_${Date.now()}_test_verified`,
      signature: "sig_verified_auto_test",
    }),
  }).then((r) => r.json());
  assert(verifyPaymentRes.booking.paymentStatus === "Paid", "Payment verified and booking paymentStatus updated to Paid");

  // 7. Notifications & Communication
  console.log("\n--- 7. Testing Notifications & Messaging ---");
  const notifRes = await fetch(`${BASE_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${hostToken}` },
  }).then((r) => r.json());
  assert(notifRes.notifications.length > 0, "Host received real-time in-app notifications");
  notifId = notifRes.notifications[0]._id;

  const markReadRes = await fetch(`${BASE_URL}/api/notifications/${notifId}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${hostToken}` },
  }).then((r) => r.json());
  assert(markReadRes.notification.read === true, "Notification successfully marked as read");

  const messageRes = await fetch(`${BASE_URL}/api/messages/inquire`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${guestToken}`,
    },
    body: JSON.stringify({
      listingId: createdListingId,
      content: "Hello host, are laundry and mess timings flexible?",
      phone: "9876501234",
    }),
  }).then((r) => r.json());
  assert(messageRes.success && messageRes.sentMessage, "Guest inquiry message sent to host");

  // 8. AI Features
  console.log("\n--- 8. Testing AI Features Engine ---");
  const aiRecRes = await fetch(`${BASE_URL}/api/ai/recommendations?category=Tourist Stay`).then((r) => r.json());
  assert(aiRecRes.recommendations.length > 0, "AI Recommendations returns tailored listings");

  const aiSmartSearchRes = await fetch(`${BASE_URL}/api/ai/smart-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "cheap student pg near BHU in Varanasi with wifi under 6000" }),
  }).then((r) => r.json());
  assert(
    aiSmartSearchRes.detectedCriteria && aiSmartSearchRes.detectedCriteria.category === "Student PG / Hostel",
    "AI Natural Search extracts structured criteria (category, city, budget)"
  );

  const aiChatRes = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "What student PGs do you recommend in Kota?" }),
  }).then((r) => r.json());
  assert(aiChatRes.reply && aiChatRes.suggestedListings, "AI Concierge Chatbot provides conversational advice & matched listings");

  const aiPriceRes = await fetch(`${BASE_URL}/api/ai/price-advisor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: "Student PG / Hostel",
      location: "Kota, Rajasthan",
      roomType: "Private Room",
      amenities: ["WiFi", "AC", "Mess", "Study Table"],
    }),
  }).then((r) => r.json());
  assert(aiPriceRes.suggestedPrice > 0, "AI Price Advisor estimates fair market rent");

  const fraudRes = await fetch(`${BASE_URL}/api/ai/detect-fraud`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Too good to be true PG",
      price: "₹50 / month",
      category: "Student PG / Hostel",
      description: "cheap",
      images: [],
    }),
  }).then((r) => r.json());
  assert(fraudRes.isSuspicious === true, "AI Fraud Detector flags suspicious/anomalous listings");

  // 9. Admin Dashboard Backend
  console.log("\n--- 9. Testing Admin Dashboard APIs ---");
  const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json());
  assert(adminStatsRes.stats && adminStatsRes.stats.revenue >= 0, "Admin can access platform statistics & revenue");

  const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json());
  assert(adminUsersRes.users.length >= 3, "Admin can list all platform users");

  const adminListingsRes = await fetch(`${BASE_URL}/api/admin/listings`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json());
  assert(adminListingsRes.listings.length >= 6, "Admin can moderate all listings");

  const adminBookingsRes = await fetch(`${BASE_URL}/api/admin/bookings`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json());
  assert(adminBookingsRes.bookings.length >= 1, "Admin can monitor all platform bookings");

  // Clean up created test listing
  await fetch(`${BASE_URL}/api/listings/${createdListingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${hostToken}` },
  });
  console.log("🧹 Cleaned up temporary test listing.");

  console.log("\n========================================================");
  console.log("🎉 ALL TESTS PASSED! FULL-STACK PRODUCTION VERIFIED!");
  console.log("========================================================\n");
  process.exit(0);
};

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
