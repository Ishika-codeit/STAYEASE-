import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authAPI } from "../services/api";
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Camera,
  Save,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "security"

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [role, setRole] = useState(user?.role || "guest");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security / Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const data = await authAPI.updateProfile({
        fullName,
        phone,
        city,
        bio,
        avatar,
        role,
      });

      updateUser(data.user);
      showToast("Profile details updated successfully! ✨", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword,
      });

      showToast("Password changed successfully 🔒", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err.message || "Failed to update password.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Account & Profile Settings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your personal information, contact credentials, and security.
            </p>
          </div>

          {/* User Hero Banner */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#00CEC9] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center font-extrabold text-white text-3xl shadow-md">
                  {fullName?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
                <span className="px-3 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs uppercase font-extrabold">
                  {user?.role}
                </span>
                {user?.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              {user?.bio && (
                <p className="text-xs text-gray-600 mt-2 italic max-w-lg">"{user.bio}"</p>
              )}
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === "profile"
                  ? "bg-[#6C5CE7] text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === "security"
                  ? "bg-[#00CEC9] text-black shadow-md"
                  : "bg-white text-gray-600 hover:text-black border border-gray-200"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Password & Security</span>
            </button>
          </div>

          {/* Tab 1: Profile Edit */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleUpdateProfile}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
                Edit Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Varanasi, UP"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Profile Avatar URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Bio / About Me
                </label>
                <textarea
                  rows="3"
                  placeholder="Share a short intro about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              {/* Role Toggle if not admin */}
              {user?.role !== "admin" && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Active Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("guest")}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        role === "guest"
                          ? "bg-[#6C5CE7] text-white border-[#6C5CE7]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      👤 Guest / Seeker
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("host")}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        role === "host"
                          ? "bg-[#00CEC9] text-black border-[#00CEC9]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      🏠 Property Host
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-sm shadow-md hover:scale-102 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? "Saving Details..." : "Save Profile Changes"}</span>
              </button>
            </form>
          )}

          {/* Tab 2: Password Security */}
          {activeTab === "security" && (
            <form
              onSubmit={handleChangePassword}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 space-y-6 max-w-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
                Change Password
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-black font-extrabold text-sm shadow-md hover:scale-102 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" />
                <span>{savingPassword ? "Updating Password..." : "Update Password"}</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Profile;
