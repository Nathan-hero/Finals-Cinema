import React, { useState, useEffect } from "react";
import { bookingAPI } from "../utils/api";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await bookingAPI.getMyBookings();
      setBookings(data.bookings);
      
    } catch (err) {
      console.error("Error fetching bookings:", err);
      
      if (err.response?.status === 401) {
        setError("Please login to view your bookings");
      } else {
        setError(err.response?.data?.message || "Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(bookingId) {
    if (!confirm("Cancel this booking?")) return;

    try {
      await bookingAPI.deleteBooking(bookingId);
      setBookings(bookings.filter((b) => b._id !== bookingId));
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to cancel booking");
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ✅ Helper function to safely display seats
  function displaySeats(seats) {
    if (!seats) return "No seats";
    
    // If it's already an array, join it
    if (Array.isArray(seats)) {
      return seats.join(", ");
    }
    
    // If it's a string, return as is
    if (typeof seats === 'string') {
      return seats;
    }
    
    // Fallback
    return "N/A";
  }

  if (!loading && !localStorage.getItem('token')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-12 max-w-md">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to view your bookings</p>
          <a 
            href="/" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
          <p className="text-white text-xl">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={fetchBookings}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Your Bookings
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-lg">No bookings yet.</p>
            <p className="text-gray-500 mt-2">Go book a movie to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-5 flex justify-between items-center hover:border-red-500 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{booking.movieTitle}</h3>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                      {booking.status || 'confirmed'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>
                      <span className="text-gray-500">Showtime:</span> {booking.showtime}
                    </p>
                    <p>
                      <span className="text-gray-500">Seats:</span> 
                      <span className="text-white font-semibold ml-2">
                        {displaySeats(booking.seats)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Booked on:</span> {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-lg font-bold text-red-500">₱{booking.totalPrice}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(booking._id)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}