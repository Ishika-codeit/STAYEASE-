import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import ListingDetails from "./pages/ListingDetails";
import Booking from "./pages/Booking";
import HostListing from "./pages/HostListing";
import MyListings from "./pages/MyListings";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/listing/:id" element={<ListingDetails />} />

            {/* Protected Guest / User Routes */}
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mybookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Host Routes */}
            <Route
              path="/hostlisting"
              element={
                <ProtectedRoute allowedRoles={["host", "admin"]}>
                  <HostListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mylistings"
              element={
                <ProtectedRoute allowedRoles={["host", "admin"]}>
                  <MyListings />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;