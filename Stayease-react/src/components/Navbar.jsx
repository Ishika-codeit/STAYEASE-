import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationsAPI } from "../services/api";
import {
  Bell,
  User,
  Shield,
  Home,
  Search,
  PlusCircle,
  List,
  Calendar,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, isHost, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      notificationsAPI
        .getAll()
        .then((data) => {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.warn("Failed to mark all notifications read:", e);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full h-20 fixed top-0 left-0 z-50 text-white flex justify-between items-center bg-black/60 backdrop-blur-xl shadow-lg border-b border-white/10 px-6 md:px-10 transition-all duration-300">
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide flex items-center group">
        <span className="bg-linear-to-r from-[#00CEC9] to-[#6C5CE7] bg-clip-text text-transparent transition duration-300 group-hover:drop-shadow-[0_0_12px_#00CEC9]">
          StayEase
        </span>
        <span className="text-[#00CEC9] ml-1 transition duration-300 group-hover:drop-shadow-[0_0_12px_#00CEC9]">
          +
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center space-x-8 text-base font-semibold">
        <Link
          to="/"
          className={`transition duration-200 hover:text-[#00CEC9] ${
            isActive("/") ? "text-[#00CEC9] border-b-2 border-[#00CEC9] pb-1" : "text-gray-200"
          }`}
        >
          Home
        </Link>

        <Link
          to="/search"
          className={`transition duration-200 hover:text-[#6C5CE7] ${
            isActive("/search") ? "text-[#6C5CE7] border-b-2 border-[#6C5CE7] pb-1" : "text-gray-200"
          }`}
        >
          Search
        </Link>

        {isHost && (
          <>
            <Link
              to="/hostlisting"
              className={`transition duration-200 hover:text-[#00CEC9] ${
                isActive("/hostlisting") ? "text-[#00CEC9] border-b-2 border-[#00CEC9] pb-1" : "text-gray-200"
              }`}
            >
              Host-Listing
            </Link>

            <Link
              to="/mylistings"
              className={`transition duration-200 hover:text-[#6C5CE7] ${
                isActive("/mylistings") ? "text-[#6C5CE7] border-b-2 border-[#6C5CE7] pb-1" : "text-gray-200"
              }`}
            >
              My Listings
            </Link>
          </>
        )}

        {isAuthenticated && (
          <Link
            to="/mybookings"
            className={`transition duration-200 hover:text-[#00CEC9] ${
              isActive("/mybookings") ? "text-[#00CEC9] border-b-2 border-[#00CEC9] pb-1" : "text-gray-200"
            }`}
          >
            My Bookings
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase font-extrabold tracking-wider transition ${
              isActive("/admin")
                ? "bg-amber-400 text-black shadow-lg"
                : "bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}
      </div>

      {/* Right Controls: Notification + Profile or Login/Signup */}
      <div className="hidden lg:flex items-center space-x-5">
        {isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-gray-200 hover:text-white"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in">
                  <div className="p-3.5 bg-gray-800/80 border-b border-gray-700 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#00CEC9] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-3.5 hover:bg-gray-800/50 transition cursor-pointer ${
                            !n.read ? "bg-[#6C5CE7]/10" : ""
                          }`}
                          onClick={() => {
                            if (n.link) navigate(n.link);
                            setNotificationsOpen(false);
                          }}
                        >
                          <p className="font-bold text-xs text-white">{n.title}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-gray-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/10"
              >
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight truncate max-w-[100px]">
                    {user?.fullName?.split(" ")[0]}
                  </p>
                  <span className="text-[10px] uppercase font-bold text-[#00CEC9]">
                    {user?.role}
                  </span>
                </div>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-[#00CEC9]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center font-bold text-white text-sm shadow-md">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="p-3 border-b border-gray-800 mb-1">
                    <p className="font-bold text-sm text-white truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <User className="w-4 h-4 text-[#00CEC9]" />
                    Profile & Settings
                  </Link>

                  {isHost && (
                    <Link
                      to="/mylistings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <List className="w-4 h-4 text-[#6C5CE7]" />
                      My Listings
                    </Link>
                  )}

                  <Link
                    to="/mybookings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <Calendar className="w-4 h-4 text-[#00CEC9]" />
                    My Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-amber-300 hover:bg-amber-400/10 transition"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-gray-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-200 hover:text-[#00CEC9] font-semibold transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex lg:hidden items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center font-bold text-white text-xs"
          >
            {user?.fullName?.charAt(0) || "U"}
          </button>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/10 text-white"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 w-full bg-gray-950/95 backdrop-blur-2xl border-b border-gray-800 p-6 space-y-4 animate-in slide-in-from-top-5">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-semibold text-gray-200 hover:text-[#00CEC9]"
          >
            🏠 Home
          </Link>

          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-semibold text-gray-200 hover:text-[#6C5CE7]"
          >
            🔍 Search Stays
          </Link>

          {isHost && (
            <>
              <Link
                to="/hostlisting"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-semibold text-gray-200 hover:text-[#00CEC9]"
              >
                ➕ List a Property
              </Link>

              <Link
                to="/mylistings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-semibold text-gray-200 hover:text-[#6C5CE7]"
              >
                📋 My Listings & Bookings
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to="/mybookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-semibold text-gray-200 hover:text-[#00CEC9]"
              >
                📅 My Bookings
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-semibold text-gray-200 hover:text-white"
              >
                👤 Profile Settings
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-bold text-amber-300"
                >
                  🛡️ Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left py-3 text-red-400 font-semibold border-t border-gray-800"
              >
                🚪 Logout ({user?.fullName})
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-xl border border-white/20 font-semibold"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;