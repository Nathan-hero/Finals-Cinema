import React, { useState, useEffect } from "react";
import { bookingAPI } from "../utils/api";

export default function SeatPicker({ show, onClose, movie, selectedSchedule, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset seats every time a new movie or schedule is selected
    setSelectedSeats([]);
  }, [movie, selectedSchedule]);

  if (!show || !movie || !selectedSchedule) return null;

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 6;

  function toggleSeat(seat) {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  }

  // ✅ Updated to save to database
  async function handleConfirm() {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    setLoading(true);

    try {
      // Create booking data
      const bookingData = {
        movieTitle: movie.title,
        showtime: selectedSchedule,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * (movie.price || 150)
      };

      // ✅ Save to database via API
      const result = await bookingAPI.createBooking(bookingData);
      
      console.log("Booking saved:", result);
      alert("Booking successful! 🎉");
      
      // Call the parent's onConfirm callback (for UI updates)
      onConfirm(selectedSeats);
      
      // Close the modal
      onClose();
      
    } catch (error) {
      console.error("Booking error:", error);
      
      // Check if token is missing
      if (error.response?.status === 401) {
        alert("Please login first to make a booking.");
      } else {
        alert("Failed to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700/50 overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-900/30 to-gray-900/30 p-6 border-b border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 group"
            disabled={loading}
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Select Your Seats
          </h3>
          
          <div className="space-y-1 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">Movie:</span> <span className="font-semibold text-white">{movie.title}</span>
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Schedule:</span> <span className="font-semibold text-white">{selectedSchedule}</span>
            </p>
          </div>
        </div>

        {/* Screen */}
        <div className="px-6 pt-6">
          <div className="relative mb-8">
            <div className="h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full opacity-70"></div>
            <p className="text-center text-xs text-gray-400 mt-2 uppercase tracking-wider">Screen</p>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 mb-6">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3">
                {/* Row Label */}
                <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded text-sm font-bold text-gray-400 border border-gray-700">
                  {row}
                </div>
                
                {/* Seats */}
                <div className="flex gap-2 flex-1 justify-center">
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatNum = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(seatNum);
                    
                    return (
                      <button
                        key={seatNum}
                        onClick={() => toggleSeat(seatNum)}
                        disabled={loading}
                        className={`w-10 h-10 rounded-lg font-semibold text-xs transition-all duration-300 border-2 ${
                          isSelected
                            ? "bg-gradient-to-br from-red-600 to-red-500 border-red-400 text-white shadow-lg shadow-red-500/50 scale-110"
                            : "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 text-gray-300 hover:border-red-400 hover:scale-105 hover:shadow-md"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm2-5h12a1 1 0 011 1v2H5V5a1 1 0 011-1zm-1 4h14v1H5v-1z"/>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600"></div>
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-500 border-2 border-red-400"></div>
              <span className="text-gray-400">Selected</span>
            </div>
          </div>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-500 transition-all duration-300 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 border border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}