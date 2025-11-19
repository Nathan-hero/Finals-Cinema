import React from "react";
// admin only access
// Summary of file: This component displays a status modal indicating the success or failure of a user removal operation.

export default function RemoveUserStatus({ isOpen, onClose, type = "success", message }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white 
                        rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50 
                        animate-scale-in">

          <div className="p-8 text-center">
            {/* ICON */}
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                type === "success" ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <svg
                className={`w-10 h-10 ${
                  type === "success" ? "text-green-500" : "text-red-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    type === "success"
                      ? "M5 13l4 4L19 7"
                      : "M6 18L18 6M6 6l12 12"
                  }
                />
              </svg>
            </div>

            {/* TITLE */}
            <h3 className="text-2xl font-bold mb-2">
              {type === "success" ? "Success!" : "Error"}
            </h3>

            {/* MESSAGE */}
            <p className="text-gray-300 mb-6">{message}</p>

            {/* BUTTON */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3
                         rounded-xl font-bold hover:from-red-500 hover:to-red-400 
                         transition-all duration-300"
            >
              Close
            </button>
          </div>

          {/* Bottom Accent */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; } 
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}
