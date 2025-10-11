import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Navbar({ user, onLogout, onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
    navigate("/"); // Return to Home for results
  }

  return (
    <nav className="bg-[#0D0D0D] text-white px-12 py-4 flex items-center justify-between shadow-md">
      {/* Left: Title */}
      <Link
        to="/"
        className="text-red-600 font-extrabold text-2xl tracking-wide"
      >
        CinEase
      </Link>

      {/* Center: Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full overflow-hidden w-[420px] shadow-inner"
      >
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-black placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 text-gray-700 hover:text-red-600 transition"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Right: Navigation + Auth */}
      <div className="flex items-center gap-10">
        <Link
          to="/"
          className="hover:text-red-500 transition text-[17px] font-light"
        >
          Movies
        </Link>
        <Link
          to="/dashboard"
          className="hover:text-red-500 transition text-[17px] font-light"
        >
          Dashboard
        </Link>

        {user ? (
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-1.5 rounded-full transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-1.5 rounded-full transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
