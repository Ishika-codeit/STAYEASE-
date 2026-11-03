import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authAPI } from "../services/api";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await authAPI.login({
        email,
        password,
        role: role === "guest" || role === "host" ? role : undefined,
      });

      // Save into reactive AuthContext
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.fullName}! ✨`, "success");

      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "host") {
          navigate("/mylistings");
        } else {
          navigate("/");
        }
      }, 600);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
      showToast(err.message || "Login failed.", "error");
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
          Find your perfect stay, discover verified student PGs and tourist rooms, or host your space with instant booking.
        </p>

        {/* Quick Demo Credentials Pill */}
        <div className="mt-8 p-4 rounded-2xl bg-black/20 backdrop-blur-md text-xs space-y-1 text-white/90 border border-white/20">
          <p className="font-bold uppercase tracking-wider text-yellow-300">Quick Demo Accounts:</p>
          <p>• Host: host@stayease.com / host123</p>
          <p>• Guest: guest@stayease.com / guest123</p>
          <p>• Admin: admin@stayease.com / admin123</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Login to Your Account</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Welcome back! Sign in to continue your journey with StayEase+.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm font-medium"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl p-3.5 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6C5CE7] font-bold"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Login Role
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
            className="w-full py-4 rounded-xl text-black font-extrabold text-sm bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] shadow-md hover:scale-102 active:scale-98 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login to StayEase+"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#6C5CE7] font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;