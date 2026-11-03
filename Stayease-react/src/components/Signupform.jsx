import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useToast } from "../context/ToastContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("guest");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      await authAPI.signup({
        fullName,
        email,
        phone,
        password,
        role,
      });

      showToast("Account created successfully! 🎉 Redirecting to login...", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Unable to create account. Please try again.");
      showToast(err.message || "Signup failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-center bg-linear-to-br from-[#6C5CE7] to-[#00CEC9] text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to StayEase+</h1>
        <p className="text-center text-lg opacity-90 max-w-md">
          Join thousands of guests and verified hosts discovering safe, comfortable stays across India.
        </p>
      </div>

      {/* Right Side */}
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Join StayEase+ and start exploring verified student PGs and accommodations.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
          />

          <input
            type="tel"
            placeholder="10-Digit Phone Number"
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 10) setPhone(val);
            }}
            required
            maxLength={10}
            className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl p-3.5 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6C5CE7] font-bold"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl p-3.5 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6C5CE7] font-bold"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Register As
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("guest")}
                className={`border rounded-xl p-3 text-xs font-bold transition ${
                  role === "guest"
                    ? "bg-[#6C5CE7] text-white border-[#6C5CE7]"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                👤 Guest
              </button>

              <button
                type="button"
                onClick={() => setRole("host")}
                className={`border rounded-xl p-3 text-xs font-bold transition ${
                  role === "host"
                    ? "bg-[#00CEC9] text-black border-[#00CEC9]"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                🏠 Host
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-black font-extrabold text-sm bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] shadow-md hover:scale-102 active:scale-98 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6C5CE7] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;