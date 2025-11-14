import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthForm from "./components/AuthForm";
import MovieDetails from "./pages/MovieDetails.jsx";
import moviesData from "./data/moviesData";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Footer from "./components/Footer.jsx";
import { moviesAPI } from "./utils/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState(moviesData); // Default to static data
  const navigate = useNavigate();

  // Check for token and user on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch movies from API
  useEffect(() => {
    async function fetchMovies() {
      try {
        const backendMovies = await moviesAPI.getAllMovies();

        // Map backend fields to frontend format
        const mappedMovies = backendMovies.map((movie) => ({
          id: movie._id,
          title: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
          runtime: movie.duration,
          rating: movie.movieRating,
          price: 210, // Default price, you can add this to backend if needed
          featured: movie.featured || false,
          schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"], // Default schedule
          about: movie.description,
          poster: movie.posterURL,
          banner: movie.bannerURL,
        }));

        // Merge backend movies into fallback data by title
        const fallbackByTitle = new Map(
          moviesData.map((movie) => [movie.title.toLowerCase(), movie])
        );
        const backendByTitle = new Map(
          mappedMovies.map((movie) => [movie.title.toLowerCase(), movie])
        );

        const mergedMovies = moviesData.map((fallbackMovie) => {
          const backendMatch = backendByTitle.get(fallbackMovie.title.toLowerCase());
          if (backendMatch) {
            return {
              ...fallbackMovie,
              ...backendMatch,
            };
          }
          return fallbackMovie;
        });

        mappedMovies.forEach((backendMovie) => {
          if (!fallbackByTitle.has(backendMovie.title.toLowerCase())) {
            mergedMovies.push(backendMovie);
          }
        });

        setMovies(mergedMovies);
      } catch (err) {
        console.error("Error fetching movies:", err);
        // Keep static data as fallback
      }
    }

    fetchMovies();
  }, []);

  // Clear ALL auth data on logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cbs_auth_v1"); // Remove old key if it exists
    setUser(null);
    setShowLogoutConfirm(false); // Close the modal
    navigate("/");
  }

  // ✅ Handle search functionality
  function handleSearch(query) {
    setSearchQuery(query);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar
        user={user}
        onLogout={() => setShowLogoutConfirm(true)} // ✅ Show confirmation modal
        onSearch={handleSearch} // ✅ Pass search handler
        moviesData={movies} // ✅ Pass fetched movies data for search suggestions
      />

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
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={user ? <Home searchQuery={searchQuery} movies={movies} /> : <AuthForm onAuthSuccess={(u) => setUser(u)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/auth" element={<AuthForm onAuthSuccess={(u) => setUser(u)} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>

      <Footer />

    </div>
  );
}