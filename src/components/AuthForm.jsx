import React, { useState } from "react";
import API from "../utils/api"; // axios instance

export default function AuthForm({ onAuthSuccess, onLogout, showLogoutConfirm, setShowLogoutConfirm }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name || !email || !password) return setErr("Fill all fields");

    try {
      const res = await API.post("/auth/register", { name, email, password });
      console.log("Register response:", res.data); // 🔍 debug
      
      const user = res.data.user;
      const token = res.data.token; // ✅ Get token from response
      
      if (!user || !token) return setErr("Registration failed. Please try again.");

      // ✅ Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onAuthSuccess(user);
      }, 2000);
    } catch (error) {
      setShowSuccessModal(false);
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) return setErr("Fill all fields");

    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data); // 🔍 debug
      
      const user = res.data.user;
      const token = res.data.token; // ✅ Get token from response
      
      if (!user || !token) return setErr("Login failed. Please try again.");

      // ✅ Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onAuthSuccess(user);
      }, 2000);
    } catch (error) {
      setShowSuccessModal(false);
      setErr(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black pt-16">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-700 shadow-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white text-center mb-4">Confirm Logout</h3>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-lg border border-green-500 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Success!</h3>
            <p className="text-gray-400 text-center">
              {isLogin ? "Login successful" : "Registration successful"}
            </p>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 p-8 rounded-lg w-80 -mt-16">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {/* Tab Navigation */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              isLogin ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              !isLogin ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {/* Form Fields */}
        <div>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 p-3 bg-zinc-800 border border-zinc-700 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-zinc-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder={isLogin ? "Email" : "Email"}
            className="w-full mb-4 p-3 bg-zinc-800 border border-zinc-700 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-zinc-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 bg-zinc-800 border border-zinc-700 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

          <button
            onClick={isLogin ? handleLogin : handleRegister}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded transition-colors"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-red-600 cursor-pointer hover:text-red-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup now" : "Login now"}
          </span>
        </p>
      </div>
    </div>
  );
}