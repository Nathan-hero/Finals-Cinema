import React, { useState } from "react";
import API from "../utils/api";

export default function AuthForm({ onAuthSuccess, onLogout, showLogoutConfirm, setShowLogoutConfirm }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // ✅ Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  // ✅ Email validation - Now supports multiple domains
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    
    // ✅ Check allowed domains
    const allowedDomains = [
      "@gmail.com",
      "@yahoo.com",
      "@outlook.com",
      "@hotmail.com",
      "@cinease.admin.com"  // Admin domain
    ];
    
    const emailLower = email.toLowerCase();
    const isAllowed = allowedDomains.some(domain => emailLower.endsWith(domain));
    
    if (!isAllowed) {
      setEmailError("Only Gmail, Yahoo, Outlook, Hotmail, or CinEase Admin emails allowed");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  // ✅ Password validation
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // ✅ Name validation
  const validateName = (name) => {
    if (!name) {
      setNameError("");
      return false;
    }
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");

    // ✅ Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setErr("Please fix the errors above");
      return;
    }

    try {
      const res = await API.post("/auth/register", { name, email, password });
      
      const user = res.data.user;
      const token = res.data.token;
      
      if (!user || !token) return setErr("Registration failed. Please try again.");

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

    // ✅ Validate fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setErr("Please fix the errors above");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });
      
      const user = res.data.user;
      const token = res.data.token;
      
      if (!user || !token) return setErr("Login failed. Please try again.");

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

  // ✅ Clear errors when switching tabs
  const switchTab = (loginMode) => {
    setIsLogin(loginMode);
    setErr("");
    setEmailError("");
    setPasswordError("");
    setNameError("");
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
            onClick={() => switchTab(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              !isLogin ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-400 hover:text-white"
            }`}
            onClick={() => switchTab(false)}
          >
            Signup
          </button>
        </div>

        {/* Form Fields */}
        <div>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="User Name"
                className={`w-full p-3 bg-zinc-800 border ${
                  nameError ? "border-red-500" : "border-zinc-700"
                } rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-zinc-600`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
                onBlur={() => validateName(name)}
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>
          )}

          <div className="mb-4">
            <input
              type="email"
              placeholder="E-mail"
              className={`w-full p-3 bg-zinc-800 border ${
                emailError ? "border-red-500" : "border-zinc-700"
              } rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-zinc-600`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              className={`w-full p-3 bg-zinc-800 border ${
                passwordError ? "border-red-500" : "border-zinc-700"
              } rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-zinc-600`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              onBlur={() => validatePassword(password)}
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

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
            onClick={() => switchTab(!isLogin)}
          >
            {isLogin ? "Signup now" : "Login now"}
          </span>
        </p>
      </div>
    </div>
  );
}