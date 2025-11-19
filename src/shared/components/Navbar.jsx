import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User } from "lucide-react";
// User access and Admin access
// Summary of file: This component renders the navigation bar with logo, search functionality, and navigation links based on user role.

export default function Navbar({ user, onLogout, onSearch, moviesData }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
    setShowSuggestions(false);

    // Navigate to appropriate movies page based on user role
    if (user && user.role === "admin") {
      navigate("/admin/movies");
    } else {
      navigate("/");
    }
  }

  // Generate search suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filteredMovies = moviesData.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      setSuggestions(filteredMovies);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [query, moviesData]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle suggestion click
  function handleSuggestionClick(movie) {
    setQuery("");
    setShowSuggestions(false);

    if (onSearch) {
      onSearch("");
    }

    const navigateTo = user && user.role === "admin" ? "/" : "/";
    navigate(navigateTo);

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("cinease:openMovie", {
          detail: movie,
        })
      );
    }, 0);
  }

  // Handle keyboard navigation
  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }

  return (
    <nav className="bg-[#0D0D0D] text-white px-12 py-4 grid grid-cols-[auto_1fr_auto] items-center shadow-md relative z-[40]">

      {/* LEFT COLUMN — Logo */}
      <div className="flex items-center">
        <Link
          to={user && user.role === "admin" ? "/admin" : "/"}
          className="flex items-center text-red-600 text-2xl tracking-wide MontserratBold"
        >
          <img
            src="/CinEase Logo.png"
            alt="CinEase Logo"
            className="h-16 w-auto"
          />
          CinEase
        </Link>
      </div>

      {/* CENTER COLUMN — Search bar */}
      <div className="relative flex justify-center z-0" ref={searchRef}>
        {user && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-full overflow-hidden w-[420px] shadow-inner"
          >
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 text-black placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 text-gray-700 hover:text-red-600 transition"
            >
              <Search size={20} />
            </button>
          </form>
        )}

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[420px] bg-white rounded-lg shadow-lg border border-gray-200 z-[9] max-h-60 overflow-y-auto"
          >
            {suggestions.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === selectedIndex ? "bg-red-50 border-red-200" : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/posters/poster1.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{movie.title}</h4>
                    <p className="text-gray-500 text-xs">{movie.genre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN — Navigation based on user role */}
      <div className="flex items-center justify-end gap-10">
        {user && user.role === "admin" ? (
          // Admin Navigation
          <>
            <Link
              to="/admin/movies"
              className={`hover:text-red-500 transition text-[17px] font-light ${location.pathname === "/admin/movies" ? "text-red-500" : ""
                }`}
            >
              Movies
            </Link>
            <Link
              to="/admin"
              className={`hover:text-red-500 transition text-[17px] font-light ${location.pathname === "/admin" ? "text-red-500" : ""
                }`}
            >
              Dashboard
            </Link>
          </>
        ) : (
          // Regular User Navigation
          <>
            <Link
              to="/"
              className={`hover:text-red-500 transition text-[17px] font-light ${location.pathname === "/" ? "text-red-500" : ""
                }`}
            >
              Movies
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`hover:text-red-500 transition text-[17px] font-light ${location.pathname === "/dashboard" ? "text-red-500" : ""
                  }`}
              >
                Dashboard
              </Link>
            )}
          </>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full">
              <User size={18} className="text-red-500" />
              <span className="text-white font-medium">{user.name}</span>
              {user.role === "admin" && (
                <span className="ml-1 text-xs text-gray-400">(Admin)</span>
              )}
            </div>

            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-1.5 rounded-full transition"
            >
              Logout
            </button>
          </div>
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