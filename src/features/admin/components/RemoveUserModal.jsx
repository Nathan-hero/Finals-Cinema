import React from "react";
// admin only access
// Summary of file: This component displays a modal to confirm the removal of one or more users.

export default function RemoveUserModal({ isOpen, count, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white 
                        rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-700/50 
                        animate-scale-in">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/50 hover:bg-red-600
                       flex items-center justify-center rounded-full transition-all duration-300 
                       backdrop-blur-sm group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3">Remove Users</h3>

            <p className="text-gray-300 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-bold text-red-400">{count}</span> user
              {count > 1 ? "s" : ""}?
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500
                           hover:from-red-500 hover:to-red-400 transition-all duration-300 
                           font-bold text-white"
              >
                Confirm
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors 
                           duration-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
