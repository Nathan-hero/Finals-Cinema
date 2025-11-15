import React, { useState, useEffect } from "react";
import { formatFriendly } from "../../../utils/format";

export default function MovieDetailsModal({ movie, onClose, onSelectSchedule, isAdmin }) {
  const [showSchedules, setShowSchedules] = useState(false);

  // Reset to details view when movie changes
  useEffect(() => {
    setShowSchedules(false);
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-700/50 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowSchedules(false);
            onClose();
          }}
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

        {!showSchedules || isAdmin ? (
          // STEP 1: Movie Details Only
          <>
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
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Runtime</p>
                    <p className="text-white text-lg font-semibold">{movie.runtime} mins</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rating</p>
                    <p className="text-white text-lg font-semibold">{movie.rating}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-xl border border-red-700/50 hover:border-red-500 transition-colors duration-300">
                    <p className="text-red-200 text-xs uppercase tracking-wider mb-1">Price</p>
                    <p className="text-white text-lg font-semibold">₱{movie.price}</p>
                  </div>
                </div>

                {/* Book Now Button */}
                {isAdmin ? (
                  <div className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Booking Not Available (Admin View)
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSchedules(true)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Book Now
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
          </>
        ) : (
          // STEP 2: Schedule Selection
          <>
            {/* Back Button */}
            <button
              onClick={() => setShowSchedules(false)}
              className="absolute top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-gray-800 rounded-full transition-all duration-300 backdrop-blur-sm text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Schedule Selection Content */}
            <div className="p-8 pt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Select a Schedule
                </h2>
                <p className="text-gray-400">
                  Choose your preferred showtime for <span className="text-white font-semibold">{movie.title}</span>
                </p>
              </div>

              {isAdmin ? (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <p className="text-gray-400 text-lg font-semibold">Booking Not Available</p>
                    <p className="text-gray-500 text-sm mt-2">Admin accounts can only view movie details</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {movie.schedule.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSelectSchedule(s)}
                      className="group relative px-6 py-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl font-medium border-2 border-gray-700 hover:border-red-500 hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:to-red-500/10 transition-all duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-sm text-gray-400 mb-1">Showtime</div>
                      <div className="text-xl font-bold">{formatFriendly(s)}</div>
                    </div>
                    <svg className="absolute bottom-2 right-2 w-5 h-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  ))}
                </div>
              )}

              {!isAdmin && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Select a schedule to proceed to seat selection
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
          </>
        )}
      </div>
    </div>
  );
}