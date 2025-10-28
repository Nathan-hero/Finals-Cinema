import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";

export default function Navbar({ user, onLogout, onSearch, moviesData }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
    setShowSuggestions(false);
    navigate("/"); // Return to Home for results
  }

  // Generate search suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filteredMovies = moviesData.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions

      setSuggestions(filteredMovies);
      setShowSuggestions(true);
      setSelectedIndex(-1); // Reset selection when suggestions change
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
    setQuery(movie.title);
    if (onSearch) onSearch(movie.title);
    setShowSuggestions(false);
    navigate("/");
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
    <nav className="bg-[#0D0D0D] text-white px-12 py-4 flex items-center justify-between shadow-md">
      {/* Left: Title with Logo */}
      <Link
        to="/"
        className="flex items-center text-red-600 text-2xl tracking-wide MontserratBold"
      >
        <img
          src="/CinEase Logo.png"
          alt="CinEase Logo"
          className="h-24 w-auto"
        />
        CinEase
      </Link>

      {/* Center: Search Bar */}
      <div className="relative" ref={searchRef}>
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

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => handleSuggestionClick(movie)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === selectedIndex
                  ? 'bg-red-50 border-red-200'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/posters/poster1.jpg'; // Fallback image
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

      {/* Right: Navigation + Auth */}
      <div className="flex items-center gap-10">
        <Link
          to="/"
          className="hover:text-red-500 transition text-[17px] font-light"
        >
          Movies
        </Link>

        {/* Only show Bookings link when logged in */}
        {user && (
          <Link
            to="/dashboard"
            className="hover:text-red-500 transition text-[17px] font-light"
          >
            Dashboard
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            {/* Display user name with icon */}
            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full">
              <User size={18} className="text-red-500" />
              <span className="text-white font-medium">{user.name}</span>
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