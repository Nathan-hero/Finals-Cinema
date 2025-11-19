import React from "react";
// admin only access
// Summary of file: This component displays a modal to confirm the removal of one or more reservations.

export default function RemoveReservationModal({
  isOpen,
  count,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black 
                        text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 
                        overflow-hidden border border-gray-700/50 animate-scale-in">

          <div className="p-8 space-y-4 text-center">
            <h2 className="text-3xl font-bold">Remove Reservations</h2>
            <p className="text-gray-300">
              Are you sure you want to remove{" "}
              <span className="font-bold text-red-400">{count}</span> reservation
              {count > 1 ? "s" : ""}?
            </p>

            <div className="flex gap-4 pt-4">
              <button
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 
                           hover:from-red-500 hover:to-red-400 text-white py-3 
                           rounded-xl font-bold transition-all duration-300"
              >
                Confirm
              </button>

              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white 
                           py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
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
    </>
  );
}
