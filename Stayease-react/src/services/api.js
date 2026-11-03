const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: (userData) => request("/auth/signup", { method: "POST", body: JSON.stringify(userData) }),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => request("/auth/me"),
  updateProfile: (profileData) => request("/auth/profile", { method: "PUT", body: JSON.stringify(profileData) }),
  changePassword: (passwords) => request("/auth/change-password", { method: "PUT", body: JSON.stringify(passwords) }),
};

// Listings API
export const listingsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== "" && v !== null)
    ).toString();
    return request(`/listings${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/listings/${id}`),
  getMyListings: () => request("/listings/host/my-listings"),
  create: (listingData) => request("/listings", { method: "POST", body: JSON.stringify(listingData) }),
  update: (id, listingData) => request(`/listings/${id}`, { method: "PUT", body: JSON.stringify(listingData) }),
  delete: (id) => request(`/listings/${id}`, { method: "DELETE" }),
  toggleAvailability: (id) => request(`/listings/${id}/availability`, { method: "PATCH" }),
  addReview: (id, reviewData) => request(`/listings/${id}/reviews`, { method: "POST", body: JSON.stringify(reviewData) }),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => request("/bookings", { method: "POST", body: JSON.stringify(bookingData) }),
  getMyBookings: () => request("/bookings/my-bookings"),
  getHostReceived: () => request("/bookings/host/received"),
  getById: (id) => request(`/bookings/${id}`),
  updateStatus: (id, status) => request(`/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};

// Payments API
export const paymentsAPI = {
  createOrder: (bookingId) => request("/payments/create-order", { method: "POST", body: JSON.stringify({ bookingId }) }),
  verifyPayment: (payload) => request("/payments/verify", { method: "POST", body: JSON.stringify(payload) }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => request("/notifications"),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => request("/notifications/read-all", { method: "PUT" }),
};

// Messages API
export const messagesAPI = {
  send: (payload) => request("/messages/inquire", { method: "POST", body: JSON.stringify(payload) }),
  getByListing: (listingId) => request(`/messages/${listingId}`),
};

// AI API
export const aiAPI = {
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/ai/recommendations${query ? `?${query}` : ""}`);
  },
  smartSearch: (prompt) => request("/ai/smart-search", { method: "POST", body: JSON.stringify({ prompt }) }),
  chat: (message, history = []) => request("/ai/chat", { method: "POST", body: JSON.stringify({ message, conversationHistory: history }) }),
  priceAdvisor: (data) => request("/ai/price-advisor", { method: "POST", body: JSON.stringify(data) }),
  detectFraud: (data) => request("/ai/detect-fraud", { method: "POST", body: JSON.stringify(data) }),
};

// Admin API
export const adminAPI = {
  getStats: () => request("/admin/stats"),
  getUsers: () => request("/admin/users"),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  getListings: () => request("/admin/listings"),
  updateListingStatus: (id, status) => request(`/admin/listings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  getBookings: () => request("/admin/bookings"),
};

export default {
  auth: authAPI,
  listings: listingsAPI,
  bookings: bookingsAPI,
  payments: paymentsAPI,
  notifications: notificationsAPI,
  messages: messagesAPI,
  ai: aiAPI,
  admin: adminAPI,
};
