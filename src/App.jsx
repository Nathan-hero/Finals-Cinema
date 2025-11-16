import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./shared/components/Navbar.jsx";
import Home from "./features/users/pages/Home.jsx";
import Dashboard from "./features/users/pages/Dashboard.jsx";
import AuthForm from "./shared/components/AuthForm.jsx";
import MovieDetails from "./features/users/pages/MovieDetails.jsx";
import moviesData from "./shared/data/moviesData.js";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import Footer from "./shared/components/Footer.jsx";
import { moviesAPI } from "./utils/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState(moviesData);
  const navigate = useNavigate();

  // Check for token and user on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // ✅ Redirect admin to /admin page on app load (only from root)
      if (parsedUser.role === "admin" && window.location.pathname === "/") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  // Fetch movies from API
  useEffect(() => {
    async function fetchMovies() {
      try {
        const backendMovies = await moviesAPI.getAllMovies();

        const mappedMovies = backendMovies.map((movie) => ({
          id: movie._id,
          title: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
          runtime: movie.duration,
          rating: movie.movieRating,
          price: 210,
          featured: movie.featured || false,
          schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
          about: movie.description,
          poster: movie.posterURL,
          banner: movie.bannerURL,
        }));

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
      }
    }

    fetchMovies();
  }, []);

  // Clear ALL auth data on logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cbs_auth_v1");
    setUser(null);
    setShowLogoutConfirm(false);
    navigate("/");
  }

  function handleSearch(query) {
    setSearchQuery(query);
  }

  // ✅ Handle successful authentication with role-based redirect
  function handleAuthSuccess(authenticatedUser) {
    setUser(authenticatedUser);
    
    // Redirect based on user role
    if (authenticatedUser.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar
        user={user}
        onLogout={() => setShowLogoutConfirm(true)}
        onSearch={handleSearch}
        moviesData={movies}
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
          {/* Root route - Login or User Home */}
          <Route 
            path="/" 
            element={
              user ? (
                user.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Home searchQuery={searchQuery} movies={movies} user={user} />
                )
              ) : (
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              )
            } 
          />

          {/* User Routes */}
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/movie/:id" 
            element={<MovieDetails />} 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />
          <Route 
            path="/admin/movies" 
            element={<Home searchQuery={searchQuery} movies={movies} isAdminView={true} user={user} />} 
          />
          <Route 
            path="/admin/movie/:id" 
            element={<MovieDetails isAdminView={true} />} 
          />

          {/* Auth Route */}
          <Route 
            path="/auth" 
            element={<AuthForm onAuthSuccess={handleAuthSuccess} />} 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}