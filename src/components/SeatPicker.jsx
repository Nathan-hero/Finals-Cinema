import React, { useState, useEffect } from "react";
import { bookingAPI } from "../utils/api";

export default function SeatPicker({ show, onClose, movie, selectedSchedule, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSeats, setFetchingSeats] = useState(false);
  const [seatFilter, setSeatFilter] = useState("all");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Fetch booked seats whenever movie or schedule changes
  useEffect(() => {
    setSelectedSeats([]);
    setSeatFilter("all");
    setBookedSeats([]); // Clear previous booked seats first
    
    if (show && movie && selectedSchedule) {
      fetchBookedSeats();
    }
  }, [movie, selectedSchedule, show]);

  async function fetchBookedSeats() {
    setFetchingSeats(true);
    try {
      const response = await bookingAPI.getBookedSeats(movie.title, selectedSchedule);
      setBookedSeats(response.bookedSeats || []);
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      setBookedSeats([]);
    } finally {
      setFetchingSeats(false);
    }
  }

  if (!show || !movie || !selectedSchedule) return null;

  // ✅ More realistic theater size - 10 rows, 12 seats per row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;

  // Determine if seat should be visible based on filter
  function isSeatVisible(seatNum) {
    const isSelected = selectedSeats.includes(seatNum);
    const isBooked = bookedSeats.includes(seatNum);
    const isAvailable = !isSelected && !isBooked;

    if (seatFilter === "all") return true;
    if (seatFilter === "available") return isAvailable;
    if (seatFilter === "selected") return isSelected;
    if (seatFilter === "booked") return isBooked;
    return true;
  }

  function toggleSeat(seat) {
    // Don't allow selecting already booked seats
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  }

  async function handleConfirm() {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        movieTitle: movie.title,
        showtime: selectedSchedule,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * (movie.price || 150)
      };

      const result = await bookingAPI.createBooking(bookingData);
      
      // ✅ Show success modal with booking details
      setBookingDetails({
        ...bookingData,
        bookingId: result.booking._id,
        bookingDate: new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      });
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error("Booking error:", error);
      
      if (error.response?.status === 401) {
        alert("Please login first to make a booking.");
      } else {
        alert("Failed to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSuccessClose() {
    setShowSuccessModal(false);
    onConfirm(selectedSeats);
    onClose();
  }

  // ✅ SUCCESS MODAL - COMPACT VERSION
  if (showSuccessModal && bookingDetails) {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full border border-green-500/50 overflow-hidden">
          
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-900/30 to-gray-900/30 p-6 text-center border-b border-green-500/30">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-1">Booking Successful!</h2>
            <p className="text-sm text-gray-400">Your seats have been reserved</p>
          </div>

          {/* Booking Details */}
          <div className="p-4 space-y-3">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Movie</p>
              <p className="text-lg font-bold text-white">{bookingDetails.movieTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Showtime</p>
                <p className="text-sm font-semibold text-white">{bookingDetails.showtime}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Booking Date</p>
                <p className="text-sm font-semibold text-white">{bookingDetails.bookingDate}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Selected Seats</p>
              <div className="flex flex-wrap gap-2">
                {bookingDetails.seats.map((seat) => (
                  <span key={seat} className="px-2.5 py-0.5 bg-red-600 rounded-full text-xs font-semibold">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg p-3 border border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-white">₱{bookingDetails.totalPrice}</p>
                </div>
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-lg p-2.5 border border-blue-700/30">
              <p className="text-xs text-blue-400 mb-1">Booking Reference ID</p>
              <p className="text-xs font-mono text-gray-300 break-all">{bookingDetails.bookingId}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 pt-0">
            <button
              onClick={handleSuccessClose}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-bold text-base hover:from-green-500 hover:to-green-400 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SEAT PICKER MODAL
  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-700/50 overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-900/30 to-gray-900/30 p-6 border-b border-gray-700/50">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-gray-800 rounded-full transition-all duration-300 backdrop-blur-sm text-sm"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 group"
            disabled={loading}
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Select Your Seats
          </h3>
          
          <div className="space-y-1 text-sm text-center">
            <p className="text-gray-300">
              <span className="text-gray-400">Movie:</span> <span className="font-semibold text-white">{movie.title}</span>
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Schedule:</span> <span className="font-semibold text-white">{selectedSchedule}</span>
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Screen */}
          <div className="relative mb-8">
            <div className="h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full opacity-70"></div>
            <p className="text-center text-xs text-gray-400 mt-2 uppercase tracking-wider">Screen</p>
          </div>

          {/* Loading State */}
          {fetchingSeats ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <p className="text-gray-400 mt-2">Loading seats...</p>
            </div>
          ) : (
            <>
              {/* Seat Grid */}
              <div className="space-y-2 mb-6">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    {/* Row Label */}
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded text-sm font-bold text-gray-400 border border-gray-700">
                      {row}
                    </div>
                    
                    {/* Seats */}
                    <div className="flex gap-1 flex-1 justify-center">
                      {Array.from({ length: seatsPerRow }, (_, i) => {
                        const seatNum = `${row}${i + 1}`;
                        const isSelected = selectedSeats.includes(seatNum);
                        const isBooked = bookedSeats.includes(seatNum);
                        const isVisible = isSeatVisible(seatNum);
                        
                        return (
                          <button
                            key={seatNum}
                            onClick={() => toggleSeat(seatNum)}
                            disabled={loading || isBooked}
                            className={`w-9 h-9 rounded-lg font-semibold text-xs transition-all duration-300 border-2 ${
                              !isVisible
                                ? "opacity-20 scale-90"
                                : isBooked
                                ? "bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed opacity-50"
                                : isSelected
                                ? "bg-gradient-to-br from-red-600 to-red-500 border-red-400 text-white shadow-lg shadow-red-500/50 scale-110"
                                : "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 text-gray-300 hover:border-red-400 hover:scale-105 hover:shadow-md"
                            } ${loading && !isBooked ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isBooked ? (
                              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm2-5h12a1 1 0 011 1v2H5V5a1 1 0 011-1zm-1 4h14v1H5v-1z"/>
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Selected Seats</p>
              <p className="text-lg font-bold text-white">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold text-red-500">
                ₱{selectedSeats.length * (movie.price || 150)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-500 transition-all duration-300 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || fetchingSeats || selectedSeats.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 border border-red-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}