import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import ManageMovies from "../components/ManageMovies";
import ManageUsers from "../components/ManageUsers";
import ManageReservations from "../components/ManageReservations";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ movies: 0, users: 0, reservations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use correct environment variable name
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    let mounted = true;

    async function fetchCounts() {
      try {
        setLoading(true);
        setError(null);

        // Get auth token
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        };

        // Fetch from admin endpoints with auth headers
        const [moviesRes, usersRes, bookingsRes] = await Promise.all([
          fetch(`${API_BASE}/admin/movies`, { headers }),
          fetch(`${API_BASE}/admin/users`, { headers }),
          fetch(`${API_BASE}/admin/reservations`, { headers })
        ]);

        // Check for auth errors
        if (moviesRes.status === 401 || usersRes.status === 401 || bookingsRes.status === 401) {
          throw new Error("Unauthorized. Please login as admin.");
        }

        if (!moviesRes.ok || !usersRes.ok || !bookingsRes.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const [moviesData, usersData, bookingsData] = await Promise.all([
          moviesRes.json(),
          usersRes.json(),
          bookingsRes.json()
        ]);

        if (!mounted) return;

        // Handle different response formats
        const moviesCount = Array.isArray(moviesData) 
          ? moviesData.length 
          : (moviesData.movies?.length ?? moviesData.count ?? 0);
        
        const usersCount = Array.isArray(usersData) 
          ? usersData.length 
          : (usersData.users?.length ?? usersData.count ?? 0);
        
        const reservationsCount = Array.isArray(bookingsData) 
          ? bookingsData.length 
          : (bookingsData.reservations?.length ?? bookingsData.count ?? 0);

        setCounts({ 
          movies: moviesCount, 
          users: usersCount, 
          reservations: reservationsCount 
        });

      } catch (err) {
        console.error("Error fetching counts:", err);
        if (mounted) {
          setError(err.message || "Error fetching counts");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCounts();

    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          type="movies" 
          count={loading ? "..." : counts.movies} 
          label="Movies" 
        />
        <StatCard 
          type="users" 
          count={loading ? "..." : counts.users} 
          label="Users" 
        />
        <StatCard 
          type="reservations" 
          count={loading ? "..." : counts.reservations} 
          label="Reservations" 
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
          <p className="font-semibold mb-1">Failed to load dashboard data</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-red-500">
            Check if: 1) Backend is running, 2) You're logged in as admin, 3) API_URL is correct
          </p>
        </div>
      )}

      {/* Management Sections */}
      <ManageMovies />
      <ManageUsers />
      <ManageReservations />
    </div>
  );
}