// EditMovieStatus.jsx
import React from "react";
// Admin only access
// Summary of file: Modal components to show confirmation and status of editing a movie


export function EditConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50">
        <div className="p-8">
          <div className="mx-auto w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-center mb-2">Confirm Update</h3>
          <p className="text-center text-gray-300 mb-6">
            Are you sure you want to update this movie?  
            This action will override the existing data.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-all duration-300">
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:from-red-500 hover:to-red-400 transition-all duration-300">
              Confirm
            </button>
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>
    </div>
  );
}

export function EditStatusModal({ isOpen, onClose, message, type = "success" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50">
        <div className="p-8 text-center">
          <div
            className={`mx-auto w-20 h-20 ${
              type === "success" ? "bg-green-500/20" : "bg-red-500/20"
            } rounded-full flex items-center justify-center mb-4`}>
            <svg
              className={`w-10 h-10 ${
                type === "success" ? "text-green-500" : "text-red-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
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

          <h3 className="text-2xl font-bold mb-2">
            {type === "success" ? "Success!" : "Error"}
          </h3>

          <p className="text-gray-300 mb-6">{message}</p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:from-red-500 hover:to-red-400 transition-all duration-300">
            Close
          </button>
        </div>

        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>
    </div>
  );
}
