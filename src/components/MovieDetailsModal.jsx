// src/components/MovieDetailsModal.jsx
import React from "react";
import { formatFriendly } from "../utils/format";

export default function MovieDetailsModal({ movie, onClose, onSelectSchedule }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-700/50 animate-scale-in">
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

        {/* Banner */}
        {movie.banner && (
          <div className="relative w-full h-56 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
            <img
              src={movie.banner}
              alt={`${movie.title} Banner`}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-2xl tracking-tight">
                {movie.title}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 p-6">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto object-cover rounded-xl shadow-2xl border-2 border-gray-700/50 transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            {/* Genres */}
            {movie.genre && (
              <div className="flex flex-wrap gap-2">
                {movie.genre.split(",").map((g, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 text-sm rounded-full border border-gray-600 hover:border-red-500 transition-colors duration-300"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* About */}
            {movie.about && (
              <p className="text-gray-300 leading-relaxed text-base">{movie.about}</p>
            )}

            {/* Info Boxes */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Runtime</p>
                <p className="text-white text-lg font-semibold">{movie.runtime} mins</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rating</p>
                <p className="text-white text-lg font-semibold">{movie.rating}</p>
              </div>
              <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-xl border border-red-700/50">
                <p className="text-red-200 text-xs uppercase tracking-wider mb-1">Price</p>
                <p className="text-white text-lg font-semibold">₱{movie.price}</p>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Select a Schedule:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {movie.schedule.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSelectSchedule(s)}
                    className="relative px-6 py-4 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-500 hover:scale-105 transition-all duration-300"
                  >
                    {formatFriendly(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>
    </div>
  );
}
