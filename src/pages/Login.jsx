import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
     const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[^\s]{8,}$/;

        if (!emailRegex.test(email)) {
            alert('ga berhasil email')
            setLoading(false);
            return;
        }

        if (!passwordRegex.test(password)) {
            alert('ga berhasil password')
            setLoading(false);
            return;
        }
        console.log('berhasil')
        const success = login(email, password)
        if (success) {
            navigate("/dashboard");
            alert('berhasillll login')
        } 
        else {
            setError("Failed to log in. Please check your credentials.")
        }
        setLoading(false);
    }
    return (
        <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
            <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-gray-500 mb-6">Enter your email and password to sign in!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block mb-1 font-medium">Email*</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4665F6]"
                />
                </div>
                <div className="relative">
                <label className="block mb-1 font-medium">Password*</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4665F6]"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-[35px] text-gray-500 focus:outline-none text-xl">
                    <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                    </button>
                </div>
                <button
                type="submit"
                className="w-full bg-[#4665F6] text-white py-2 rounded-md hover:bg-[#46a1f6] transition">
                Sign In
                </button>
            </form>

            <p className="mt-4 text-center">
                Don’t have an account? 
                <span
                    className="font-semibold cursor-pointer text-black"
                    onClick={() => navigate("/register")}>
                    Sign Up
                    </span>
            </p>
            </div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden md:flex w-1/2 bg-[#4665F6] text-white flex-col justify-center items-center">
            <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-white mb-4"></div>
            <h1 className="text-3xl font-bold">BankTech Pro</h1>
            <p className="text-center mt-2 px-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
            </div>
        </div>
    </div>
    );
}