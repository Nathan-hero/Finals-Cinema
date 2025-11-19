import React from "react";
// Admin only access
// Summary of file: Modal component for editing reservation details in admin dashboard

export default function EditReservationModal({
  isOpen,
  reservation,
  setReservation,
  onSave,
  onClose,
}) {
  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm animate-fade-in">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black 
                      text-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden 
                      border border-gray-700/50 animate-scale-in">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/60 hover:bg-red-600
                     flex items-center justify-center rounded-full transition-all duration-300 
                     backdrop-blur-sm group"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pb-4">
          <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" 
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 4v16m8-8H4" />
            </svg>
            Edit Reservation
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="text-sm text-gray-300">Movie Title</label>
            <input
              type="text"
              value={reservation.movieTitle}
              onChange={(e) => setReservation({ ...reservation, movieTitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 
                         focus:outline-none focus:border-red-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Showtime</label>
            <input
              type="text"
              value={reservation.showtime}
              onChange={(e) => setReservation({ ...reservation, showtime: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 
                         focus:outline-none focus:border-red-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Seats (comma-separated)</label>
            <input
              type="text"
              value={reservation.seats}
              onChange={(e) => setReservation({ ...reservation, seats: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 
                         focus:outline-none focus:border-red-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Total Price</label>
            <input
              type="number"
              value={reservation.totalPrice}
              onChange={(e) =>
                setReservation({
                  ...reservation,
                  totalPrice: Number(e.target.value),
                })
              }
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 
                         focus:outline-none focus:border-red-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Status</label>
            <select
              value={reservation.status}
              onChange={(e) => setReservation({ ...reservation, status: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 
                         focus:outline-none focus:border-red-500 transition-all duration-300"
            >
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 
                         hover:from-red-500 hover:to-red-400 transition-all duration-300 
                         font-bold"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }

        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.25s ease-out; }
      `}</style>
    </div>
  );
}
