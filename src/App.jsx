import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthForm from "./components/AuthForm";
import MovieDetails from "./pages/MovieDetails.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cbs_auth_v1");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function handleLogout() {
    localStorage.removeItem("cbs_auth_v1");
    setUser(null);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<AuthForm onAuthSuccess={(u) => setUser(u)} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
      <footer className="text-center text-xs py-3 text-slate-500">
        © 2025 CineMate — Vite + React + Tailwind
      </footer>
    </div>
  );
}
