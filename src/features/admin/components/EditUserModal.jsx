import React from "react";

export default function EditUserModal({
  isOpen,
  editingUser,
  setEditingUser,
  onSave,
  onClose,
}) {
  if (!isOpen || !editingUser) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-700/50 animate-scale-in">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-8 pb-4">
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Edit User
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none focus:border-red-500 transition-colors duration-300"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-300 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={onSave}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-300 font-bold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
        </div>
      </div>
    </>
  );
}
