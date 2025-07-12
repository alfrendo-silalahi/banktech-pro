import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false);

    // const {login} = useAuth();
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[^\s]{8,}$/;

        if (!emailRegex.test(email)) {
            // setError("Invalid email format.");
            // setLoading(false);
            alert('ga berhasil email')
            return;
        }

        if (!passwordRegex.test(password)) {
            // setError("Invalid email format.");
            // setLoading(false);
            alert('ga berhasil password')
            return;
        }
        console.log('berhasil')
        const success = login(email, password)
        if (success) {
            //navigate("");
            alert('berhasillll login')
        } 
        else {
            setError("Failed to log in. Please check your credentials.")
        }
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
                <label className="block mb-1 font-medium">Email<span className="text-red-500">*</span></label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                </div>
                <div>
                <label className="block mb-1 font-medium">Password<span className="text-red-500">*</span></label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4665F6]"
                />
                </div>
                <button
                type="submit"
                className="w-full bg-[#8196F4] text-white py-2 rounded-md hover:bg-[#4665F6] transition"
                >
                Sign In
                </button>
            </form>

            <p className="mt-4 text-center">
                Don’t have an account? <span className="font-semibold cursor-pointer">Sign Up</span>
            </p>
            </div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden md:flex w-1/2 bg-[#4665F6] text-white flex-col justify-center items-center">
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                    <img src="src/assets/LOGO.svg" alt="logo" className="h-16 w-16 object-contain" />
                    <h1 className="text-4xl font-bold">BankTech Pro</h1>
                </div>
                <p className="text-center mt-2 px-8">
                    Your Digital Banking Partner
                </p>
            </div>
        </div>
    </div>
    );
}