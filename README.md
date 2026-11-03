# StayEase+ — Production Accommodation & Space Marketplace

StayEase+ is a comprehensive, production-grade MERN accommodation platform built for discovering and booking Student PGs, Tourist Accommodations, Monthly Rental Rooms, Coaching Stays, Short-Stays, and Parking Spaces, equipped with **interactive Three.js 3D Virtual Tours**, **AI-Powered Natural Search & Concierge**, and real-time host booking management.

---

## 🌟 Key Features Implemented

### 1. 3D Visuals & Virtual Tour
- **Three.js Interactive 3D Room Experience (`ThreeDRoomViewer.jsx`)**: 360° orbital rotation, zoom, daylight/nighttime ambient illumination toggling, and furniture inspection (King bed, ergonomic study workstation, split AC, wardrobe).
- Accessible via the **"Experience 3D Tour"** modal on the Hero page and inside the **Listing Details** 3D tab.

### 2. Multi-Role Authentication & User Profile
- JWT-based authentication with `guest`, `host`, and `admin` roles.
- Role-protected routes on both backend (`authorize(...)`) and frontend (`ProtectedRoute.jsx`).
- Profile management page (`/profile`): Name, phone, city, bio, avatar URL, and secure password updates.
- Dynamic user profile and notification dropdown in the responsive navbar.

### 3. Dynamic Listing Management
- MongoDB `Listing` model with coordinates, category, price, room type, amenities, reviews, and status (`approved`, `pending`, `flagged`).
- Full CRUD APIs with ownership verification (hosts can edit/delete only their own properties; admins have platform-wide moderation rights).
- Real-time availability toggling switch.
- Multi-image gallery with thumbnail selector.

### 4. Advanced Search & AI Natural Language Search
- Standard multi-filter: City/location, accommodation category, budget range, room type, and sorting (price low-high, high-low, rating, newest).
- **AI Smart Search**: Natural language query parser (e.g., *"cheap student pg near BHU with wifi and AC under 5000"*) that extracts structured database criteria automatically.

### 5. Booking System & Host Received Reservations
- MongoDB `Booking` model with availability validation and conflict prevention.
- Guests can reserve stays with date selectors and total price calculations with breakdown.
- **Host Dashboard (`/mylistings`)**:
  - **My Properties Tab**: Manage listed properties, edit availability, view details.
  - **Received Bookings Tab**: View incoming reservations with guest contact details and **Accept & Confirm**, **Reject**, or **Complete** them with real-time guest notifications.
- **My Bookings (`/mybookings`)**: Guests can monitor booking statuses (`Pending`, `Confirmed`, `Cancelled`, `Completed`) and cancel upcoming stays.

### 6. Payment Flow Integration
- Integrated checkout workflow with backend order creation (`POST /api/payments/create-order`) and cryptographic HMAC verification (`POST /api/payments/verify`).
- Celebratory confetti on verified payment confirmation.

### 7. AI Engine
- **StayEase AI Concierge Chatbot**: Floating assistant widget answering queries regarding student PGs, coaching centers, rules, pricing, and recommending matching accommodations.
- **AI Price Advisor**: Estimates fair market rent for hosts based on location tier, category, room type, and amenities.
- **AI Fraud / Suspicious Listing Detector**: Analyzes anomaly thresholds in price and descriptions.
- **AI Content Recommendations**: Suggests similar accommodations dynamically on listing pages.

### 8. Interactive Maps & Location Connectivity
- OpenStreetMap embed with exact coordinates pinpoint.
- Calculated transit distances and travel times to nearby colleges (e.g. BHU), coaching institutes (e.g. Allen in Kota), and metro/railway stations.
- Direct Google Maps navigation link.

### 9. Admin Dashboard (`/admin`)
- Accessible to users with `admin` role.
- Real-time platform metrics: Total users, listings, bookings, and verified revenue.
- User management table: Update roles (`guest`, `host`, `admin`) and remove accounts.
- Listing moderation: Approve or flag suspicious properties.
- Global booking monitor.

---

## 🔑 Demo Credentials

To test all workflows immediately, use the pre-seeded accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@stayease.com` | `admin123` | Full platform moderation, admin dashboard, user role editing |
| **Host** | `host@stayease.com` | `host123` | Create listings, toggle availability, accept/reject bookings |
| **Guest** | `guest@stayease.com` | `guest123` | Search, book stays, checkout payment, leave reviews, chat with host |

---

## 🚀 Quick Setup & Run Instructions

### 1. Backend Server (`Stayease-server`)
```bash
cd Stayease-server
npm install
node seed.js    # Seeds demo accounts and realistic listings into MongoDB
node server.js  # Starts backend server on http://localhost:5000
```

> **Note on MongoDB**: `config/db.js` attempts MongoDB Atlas first; if your current network IP is not whitelisted on Atlas, it automatically and gracefully falls back to your local MongoDB instance (`mongodb://127.0.0.1:27017/stayease`), ensuring uninterrupted uptime.

### 2. Frontend Client (`Stayease-react`)
```bash
cd Stayease-react
npm install
npm run dev     # Starts Vite development server on http://localhost:5173
```
Or build for production:
```bash
npm run build   # Produces optimized production bundle in dist/
```

### 3. Automated End-to-End Test Suite
Run the comprehensive backend verification script:
```bash
cd Stayease-server
node test-all-flows.js
```
