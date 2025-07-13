import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[^\s]{8,}$/;

    if (!emailRegex.test(email)) {
      alert("Email tidak valid");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password harus minimal 8 karakter dan mengandung huruf besar, kecil, angka, dan simbol");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi tidak sama");
      setLoading(false);
      return;
    }

    const success = await register(email, password, firstName, lastName);
    if (success) {
      alert("Registrasi berhasil!");
      navigate("/signin");
    } else {
      setError("Gagal registrasi. Coba lagi.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
          <p className="text-gray-500 mb-6">
            Complete the form to sign up and get started!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-1 font-medium">First Name*</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-1 font-medium">Last Name*</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Email*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 font-medium">Password*</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-[35px] text-gray-500 text-xl"
              >
                <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
              </button>
            </div>

            <div className="relative">
              <label className="block mb-1 font-medium">Confirm Password*</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-[35px] text-gray-500 text-xl"
              >
                <i className={showConfirmPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <span
              className="font-semibold cursor-pointer text-black"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden md:flex w-1/2 bg-orange-500 text-white flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="src/assets/LOGO.svg"
              alt="logo"
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-4xl font-bold">BankTech Pro</h1>
          </div>
          <p className="text-center mt-2 px-8">Your Digital Banking Partner</p>
        </div>
      </div>
    </div>
  );
}
