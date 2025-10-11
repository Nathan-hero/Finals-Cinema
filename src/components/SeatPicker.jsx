import React, { useState, useEffect } from "react";

export default function SeatPicker({ show, onClose, movie, selectedSchedule, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // Reset seats every time a new movie or schedule is selected
    setSelectedSeats([]);
  }, [movie, selectedSchedule]);

  if (!show || !movie || !selectedSchedule) return null; // ✅ Prevent crash if movie is null

  const seats = Array.from({ length: 30 }, (_, i) => i + 1); // 30 seats sample data

  function toggleSeat(seat) {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  }

  function handleConfirm() {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    onConfirm(selectedSeats);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">Select Seats</h3>
        <p className="text-sm mb-4">
          Movie: <strong>{movie.title}</strong> <br />
          Schedule: <strong>{selectedSchedule}</strong>
        </p>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {seats.map((seat) => (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              className={`py-2 rounded ${
                selectedSeats.includes(seat)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {seat}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
