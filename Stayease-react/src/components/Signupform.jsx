import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("guest");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password match
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

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        setError(data.message || "Signup failed.");
        setLoading(false);
        return;
      }

      // Success
      setSuccess("Account created successfully! 🎉");
      setLoading(false);

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Signup Error:", error);

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
          Find your perfect stay, discover amazing places
          and become a host with just a few clicks.
        </p>

      </div>

     
      {/* Right Side */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-2">
          Create Account
        </h2>

        <p className="text-gray-500 mb-8">
          Join StayEase and start exploring.
        </p>


        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}


        {/* Success Message */}
        {success && (
  <div className="mb-5 rounded-2xl border border-[#6C5CE7]/20 bg-linear-to-r from-[#6C5CE7]/10 to-[#00CEC9]/10 p-4 shadow-sm">
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center text-white font-bold">
        ✓
      </div>

      <div>
        <p className="font-semibold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent">
          Account Created Successfully
        </p>

        <p className="text-sm text-gray-500">
          Welcome to StayEase+! Redirecting you to login...
        </p>
      </div>

    </div>
  </div>
)}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          />


          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
          />


          {/* Phone */}
          <input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  }}
  required
  maxLength={10}
  pattern="[0-9]{10}"
  title="Phone number must be exactly 10 digits"
  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
/>

          {/* Password */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-xl p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6C5CE7] font-semibold"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>


          {/* Confirm Password */}
          <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              className="w-full border rounded-xl p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6C5CE7] font-semibold"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>

          </div>


          {/* Role */}
          <div>

            <p className="font-semibold mb-3">
              Register As
            </p>

            <div className="grid grid-cols-2 gap-4">

              {/* Guest */}
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


              {/* Host */}
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


          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold
            bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
            hover:from-[#5a4bd6] hover:to-[#00b5b0]
            hover:scale-[1.02]
            active:scale-[0.98]
            active:opacity-80
            transition-all duration-200
            shadow-md hover:shadow-lg
            disabled:opacity-60
            disabled:cursor-not-allowed
            disabled:hover:scale-100"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>


        {/* Divider */}
        <div className="my-6 text-center text-gray-500">
          OR
        </div>


        {/* Google */}
        <button
          type="button"
          className="w-full border rounded-xl py-3 font-semibold hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>


        {/* Login */}
       <div className="text-center mt-7 pt-5 border-t border-gray-100">
  <p className="text-sm text-gray-500">
    Already registered with StayEase+?
  </p>

  <Link
    to="/login"
    className="inline-block mt-1 font-semibold
    bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]
    bg-clip-text text-transparent
    hover:opacity-80 transition"
  >
    Login to your account →
  </Link>
</div>

      </div>
    </div>
  );
};

export default SignupForm;