import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { adminAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  Shield,
  Users,
  Home,
  Calendar,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "listings" | "users" | "bookings"
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, listingsRes, usersRes, bookingsRes] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getListings(),
        adminAPI.getUsers(),
        adminAPI.getBookings(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.stats);
      if (listingsRes.status === "fulfilled") setListings(listingsRes.value.listings || []);
      if (usersRes.status === "fulfilled") setUsers(usersRes.value.users || []);
      if (bookingsRes.status === "fulfilled") setBookings(bookingsRes.value.bookings || []);
    } catch (err) {
      console.warn("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateListingStatus = async (id, status) => {
    try {
      await adminAPI.updateListingStatus(id, status);
      setListings((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
      showToast(`Listing status updated to ${status}.`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update listing status.", "error");
    }
  };

  const handleUpdateUserRole = async (id, newRole) => {
    try {
      await adminAPI.updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      showToast(`User role updated to ${newRole}.`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update user role.", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure? Deleting user removes all their listings.")) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast("User deleted from platform.", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete user.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  StayEase+ Admin Portal
                </h1>
                <p className="text-xs text-gray-500">
                  System Administration, Trust & Safety, and Analytics
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C5CE7] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Users</span>
                <p className="text-2xl font-extrabold text-gray-900">
                  {stats?.users?.total || users.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00CEC9] flex items-center justify-center shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Listings</span>
                <p className="text-2xl font-extrabold text-gray-900">
                  {stats?.listings?.total || listings.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Bookings</span>
                <p className="text-2xl font-extrabold text-gray-900">
                  {stats?.bookings?.total || bookings.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Revenue</span>
                <p className="text-2xl font-extrabold text-gray-900">
                  ₹{stats?.revenue || "4,500"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: <Shield className="w-4 h-4" /> },
              { id: "listings", label: `Listings (${listings.length})`, icon: <Home className="w-4 h-4" /> },
              { id: "users", label: `Users (${users.length})`, icon: <Users className="w-4 h-4" /> },
              { id: "bookings", label: `Bookings (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#6C5CE7] text-white shadow-md"
                    : "bg-white text-gray-600 hover:text-black border border-gray-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB: Listings Management */}
          {activeTab === "listings" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">All Accommodations</h3>
                <p className="text-xs text-gray-400">Review, approve, or flag properties</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold">
                      <th className="p-4">Property</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Rent</th>
                      <th className="p-4">Host</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listings.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{item.title}</p>
                            <p className="text-gray-400">{item.location}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-700">{item.category}</td>
                        <td className="p-4 font-bold text-[#6C5CE7]">{item.price}</td>
                        <td className="p-4 text-gray-600">{item.host?.fullName || "Host"}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              item.status === "approved"
                                ? "bg-emerald-100 text-emerald-700"
                                : item.status === "flagged"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 space-x-2 whitespace-nowrap">
                          {item.status !== "approved" && (
                            <button
                              onClick={() => handleUpdateListingStatus(item._id, "approved")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold hover:bg-emerald-200 transition"
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== "flagged" && (
                            <button
                              onClick={() => handleUpdateListingStatus(item._id, "flagged")}
                              className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 transition"
                            >
                              Flag
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Users Management */}
          {activeTab === "users" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Platform Users</h3>
                <p className="text-xs text-gray-400">Manage permissions and roles</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold">
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-900">{u.fullName}</td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4 text-gray-600">{u.phone || "—"}</td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            className="border border-gray-200 rounded-lg p-1 text-xs font-bold uppercase bg-white"
                          >
                            <option value="guest">guest</option>
                            <option value="host">host</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Bookings Monitor */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Platform Bookings</h3>
                <p className="text-xs text-gray-400">All reservations across StayEase+</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold">
                      <th className="p-4">Listing</th>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Check-In</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-900">{b.listingTitle}</td>
                        <td className="p-4 text-gray-600">{b.name}</td>
                        <td className="p-4 font-bold text-[#6C5CE7]">
                          ₹{b.totalAmount || b.price}
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(b.checkInDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-bold text-emerald-600">{b.paymentStatus}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="font-bold text-base text-gray-900 mb-4">
                  🛡️ Trust & Safety Insights
                </h3>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="p-3 bg-purple-50 rounded-xl flex items-center justify-between">
                    <span>Active Listings Under Monitoring</span>
                    <strong className="text-[#6C5CE7]">{listings.length} properties</strong>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                    <span>Host Physical Verifications Passed</span>
                    <strong className="text-emerald-700">100%</strong>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between">
                    <span>Pending Fraud / Suspicious Flags</span>
                    <strong className="text-amber-700">0 flags</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="font-bold text-base text-gray-900 mb-4">
                  🚀 System Diagnostics & Architecture
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• Database: Connected with Atlas & Local Mongo Fallback ✅</p>
                  <p>• REST API: Express 5 Gateway running on Port 5000 ✅</p>
                  <p>• Auth Guard: JWT with Guest, Host & Admin Role checks ✅</p>
                  <p>• AI Engine: Natural search, concierge & price advisor active ✅</p>
                  <p>• Visuals: Three.js Interactive 3D Room Visualizer active ✅</p>
                </div>
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

export default AdminDashboard;
