import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
      role,
    });
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
            className="w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-[#6C5CE7] to-[#00CEC9]"
          >
            Login
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