import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookingAPI } from "../../../utils/api";
// User access (Admin cannot access this section because they have their own dashboard)
// Summary of file: This component displays the user dashboard with their movie reservations, allowing cancellations.

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModal, setCancelModal] = useState({
    open: false,
    booking: null,
    loading: false,
  });
  const [statusModal, setStatusModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

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

  function handleDelete(booking) {
    setCancelModal({
      open: true,
      booking,
      loading: false,
    });
  }

  function closeCancelModal() {
    setCancelModal({
      open: false,
      booking: null,
      loading: false,
    });
  }

  function showStatus(type, title, message) {
    setStatusModal({
      open: true,
      type,
      title,
      message,
    });
  }

  function closeStatusModal() {
    setStatusModal((prev) => ({ ...prev, open: false }));
  }

  async function confirmCancellation() {
    if (!cancelModal.booking) return;

    try {
      setCancelModal((prev) => ({ ...prev, loading: true }));
      await bookingAPI.deleteBooking(cancelModal.booking._id);
      setBookings((prev) => prev.filter((b) => b._id !== cancelModal.booking._id));
      closeCancelModal();
      showStatus(
        "success",
        "Booking Cancelled",
        `${cancelModal.booking.movieTitle} - ${cancelModal.booking.showtime}`
      );
    } catch (error) {
      console.error("Delete error:", error);
      setCancelModal((prev) => ({ ...prev, loading: false }));
      showStatus(
        "error",
        "Cancellation Failed",
        error.response?.data?.message || "Failed to cancel booking. Please try again."
      );
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

  // Helper function to safely display seats
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
    <div className="min-h-screen bg-black text-white p-6 pb-24 pt-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Cinema Reservations
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-[#1A1A1A] border-gray-800 rounded-lg p-12 text-center">
            {/* The svg and strokeLinecap portion is the image, we can use our logo here instead or any design you want */}
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-lg">You have no movie reservations</p>
            <Link
              to="/"
                className="hover:text-red-500 transition text-[17px] font-light"
            >
              <button
                className="bg-red-600 hover:bg-red-800 text-white px-6 py-2 rounded-full font-semibold transition-colors mt-6"
              >

                Browse for movies
              </button>         
            </Link>


          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#1A1A1A] border-gray-900 rounded-lg p-5 flex justify-between items-center hover:border-red-500 transition-colors"
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
                    <p className="text-lg font-bold text-red-500">Price: ₱{booking.totalPrice}</p>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end">
                  {/* Movie status indicator NOTE: we can use featured as a form of verification if the status is completed or not | another option | we can also just base it on date */}
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-gray-400 text-sm tracking-wide">Status:</span>
                    <span
                      className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                        booking.isOngoing
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {booking.isOngoing ? "Ongoing" : "Completed"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(booking)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-7 py-1.5 rounded-full tracking-wide transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModal.open && cancelModal.booking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-lg w-full border border-red-700/50 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                </svg>
                <div>
                  <h3 className="text-2xl font-bold">Cancel Reservation?</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Movie:</span>
                  <span className="font-semibold text-white">{cancelModal.booking.movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Showtime:</span>
                  <span className="font-semibold text-white">{cancelModal.booking.showtime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seats:</span>
                  <span className="font-semibold text-white">{displaySeats(cancelModal.booking.seats)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-semibold text-red-400">₱{cancelModal.booking.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-950/70 border-t border-gray-800 px-6 py-4 flex gap-3">
              <button
                onClick={closeCancelModal}
                disabled={cancelModal.loading}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                disabled={cancelModal.loading}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelModal.loading && (
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                )}
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50 overflow-hidden">
            <div className={`p-6 flex flex-col items-center text-center gap-4 ${statusModal.type === "success" ? "text-green-400" : "text-red-400"}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${statusModal.type === "success" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {statusModal.type === "success" ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{statusModal.title}</h3>
                <p className="text-gray-400">{statusModal.message}</p>
              </div>
            </div>
            <div className="bg-gray-950/70 border-t border-gray-800 px-6 py-4">
              <button
                onClick={closeStatusModal}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold hover:from-gray-600 hover:to-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}