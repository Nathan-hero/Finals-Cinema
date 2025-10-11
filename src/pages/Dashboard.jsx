import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { formatFriendly } from "../utils/format";

export default function Dashboard() {
  const [bookings, setBookings] = useLocalStorage("cbs_bookings_v1", []);

  function handleDelete(id) {
    if (!confirm("Cancel this booking?")) return;
    setBookings(bookings.filter((b) => b.id !== id));
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-slate-600">No bookings yet. Go book a movie!</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border rounded shadow-sm p-3 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-slate-600">
                  {formatFriendly(b.schedule)} • Seats: {b.seats.join(", ")}
                </div>
                <div className="text-sm font-bold text-indigo-600">₱{b.total}</div>
              </div>
              <button
                onClick={() => handleDelete(b.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
