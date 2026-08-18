import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed.");
      setLoading(false);
      return;
    }

    // Save logged-in user
    localStorage.setItem("token", data.token);

localStorage.setItem(
  "user",
  JSON.stringify(data.user)
);

    setSuccess("Welcome back! Login successful ✨");
    setLoading(false);

    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch (error) {
    console.error("Login Error:", error);

    setError(
      "Unable to connect to server. Please try again."
    );

    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-center bg-linear-to-br from-[#6C5CE7] to-[#00CEC9] text-white p-10">

        <h1 className="text-4xl font-bold mb-4">
          Welcome to StayEase+
        </h1>

        <p className="text-center text-lg opacity-90">
          Find your perfect stay, discover amazing places and become a host with just a few clicks.
        </p>

      </div>

      {/* Right Side */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-2">
            Login to Your Account
        </h2>

        <p className="text-gray-500 mb-8">
           Welcome back! Sign in to continue your journey with StayEase.
        </p>
        {error && (
  <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
    {error}
  </div>
)}

{success && (
  <div className="mb-5 rounded-2xl border border-[#6C5CE7]/20 bg-linear -to-r from-[#6C5CE7]/10 to-[#00CEC9]/10 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center text-white font-bold">
        ✓
      </div>

      <div>
        <p className="font-semibold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent">
          Login Successful
        </p>

        <p className="text-sm text-gray-500">
          Welcome back to StayEase+!
        </p>
      </div>
    </div>
  </div>
)}

        <form onSubmit={handleSubmit} className="space-y-5">

          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          />

           <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border rounded-xl p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6C5CE7] font-semibold"
  >
    {showPassword ? "Hide" : "Show"}
  </button>

</div>
       
          <div>
            <p className="font-semibold mb-3">Login As</p>

            <div className="grid grid-cols-2 gap-4">

              <button
                type="button"
                onClick={() => setRole("guest")}
                className={`border rounded-xl p-3 transition ${
                  role === "guest"
                    ? "bg-[#6C5CE7] text-white"
                    : "hover:bg-[#6C5CE7] hover:text-white"
                }`}
              >
                👤 Guest
              </button>

              <button
                type="button"
                onClick={() => setRole("host")}
                className={`border rounded-xl p-3 transition ${
                  role === "host"
                    ? "bg-[#00CEC9] text-white"
                    : "hover:bg-[#00CEC9] hover:text-white"
                }`}
              >
                🏠 Host
              </button>

            </div>
          </div>
           <div className="flex justify-between items-center text-sm">

  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      className="accent-[#6C5CE7]"
    />
    Remember Me
  </label>

  <Link
    to="/forgot-password"
    className="text-[#6C5CE7] hover:underline font-medium"
  >
    Forgot Password?
  </Link>

</div>
        <button
  type="submit"
  disabled={loading}
  className="w-full py-3 rounded-xl text-white font-semibold
  bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
  hover:from-[#5a4bd6] hover:to-[#00b5b0]
  hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-200
  shadow-md hover:shadow-lg
  disabled:opacity-60
  disabled:cursor-not-allowed"
>
  {loading ? "Logging in..." : "Login"}
</button>

        </form>

        <div className="my-6 text-center text-gray-500">
          OR
        </div>

        <button className="w-full border rounded-xl py-3 font-semibold hover:bg-gray-100 transition">
          Continue with Google
        </button>

        <p className="text-center mt-6">
            Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#6C5CE7] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;