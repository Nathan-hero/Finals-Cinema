import React, { useState, useEffect } from "react";
import { formatFriendly } from "../../../utils/format";

export default function MovieDetailsModal({ movie, onClose, onSelectSchedule, isAdmin }) {
  const [showSchedules, setShowSchedules] = useState(false);

  // Reset to details view when movie changes
  useEffect(() => {
    setShowSchedules(false);
  }, [movie]);

  if (!movie) return null;

  // Map backend fields to frontend display
  const movieDetails = {
    title: movie.title,
    genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
    about: movie.about || movie.description, // Backend uses "description"
    runtime: movie.runtime || movie.duration, // Backend uses "duration"
    rating: movie.rating || movie.movieRating, // Backend uses "movieRating"
    price: movie.price || 210, // Default price if not set
    poster: movie.poster || movie.posterURL, // Backend uses "posterURL"
    banner: movie.banner || movie.bannerURL, // Backend uses "bannerURL"
    releaseDate: movie.releaseDate,
    language: movie.language,
    starring: movie.starring,
    creators: movie.creators
  };

  // Handle both old format (schedule) and new format (schedules)
  const movieSchedules = movie.schedules || movie.schedule || [];
  const hasSchedules = movieSchedules.length > 0;

  const dateFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const timeFormatOptions = { hour: "numeric", minute: "2-digit" };

  const getScheduleDisplayInfo = (schedule, index) => {
    if (schedule && typeof schedule === "object") {
      const dateObj = schedule.date ? new Date(schedule.date) : null;
      return {
        cinema: schedule.cinema || `Cinema ${index + 1}`,
        date: dateObj
          ? dateObj.toLocaleDateString("en-US", dateFormatOptions)
          : "Date TBA",
        time: schedule.time ||
          (dateObj
            ? dateObj.toLocaleTimeString("en-US", timeFormatOptions)
            : "Time TBA"),
        seats:
          typeof schedule.availableSeats === "number"
            ? `${schedule.availableSeats}`
            : "100",
        value: schedule,
      };
    }

    const parsed = new Date(schedule);
    const validDate = !isNaN(parsed.getTime());
    return {
      cinema: `Cinema ${((index % 4) + 1)}`,
      date: validDate
        ? parsed.toLocaleDateString("en-US", dateFormatOptions)
        : "Date TBA",
      time: validDate
        ? parsed.toLocaleTimeString("en-US", timeFormatOptions)
        : "Time TBA",
      seats: "100",
      value: schedule,
    };
  };

  // Format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

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

        {!showSchedules ? (
          // STEP 1: Movie Details Only
          <>
            {/* Banner */}
            {movieDetails.banner && (
              <div className="relative w-full h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
                <img
                  src={movieDetails.banner}
                  alt={`${movieDetails.title} Banner`}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-2xl tracking-tight">
                    {movieDetails.title}
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
                    src={movieDetails.poster}
                    alt={movieDetails.title}
                    className="w-full h-auto object-cover rounded-xl shadow-2xl border-2 border-gray-700/50 transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                {/* Genres */}
                {movieDetails.genre && (
                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genre.split(",").map((g, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 text-sm rounded-full border border-gray-600 hover:border-red-500 transition-colors duration-300"
                      >
                        {g.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Additional Info Row - Release Date, Language, Cast, Directors */}
                <div className="space-y-2">
                  {movieDetails.releaseDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400">Release Date:</span>
                      <span className="text-white font-medium">{formatReleaseDate(movieDetails.releaseDate)}</span>
                    </div>
                  )}

                  {movieDetails.language && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="text-gray-400">Language:</span>
                      <span className="text-white font-medium">{movieDetails.language}</span>
                    </div>
                  )}

                  {movieDetails.starring && Array.isArray(movieDetails.starring) && movieDetails.starring.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-400">Cast:</span>
                      <span className="text-white font-medium flex-1">{movieDetails.starring.join(", ")}</span>
                    </div>
                  )}

                  {movieDetails.creators && Array.isArray(movieDetails.creators) && movieDetails.creators.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400">Directors:</span>
                      <span className="text-white font-medium flex-1">{movieDetails.creators.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* About */}
                {movieDetails.about && (
                  <p className="text-gray-300 leading-relaxed text-base">{movieDetails.about}</p>
                )}

                {/* Info Boxes */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Runtime</p>
                    <p className="text-white text-lg font-semibold">{movieDetails.runtime} mins</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rating</p>
                    <p className="text-white text-lg font-semibold">{movieDetails.rating}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-xl border border-red-700/50 hover:border-red-500 transition-colors duration-300">
                    <p className="text-red-200 text-xs uppercase tracking-wider mb-1">Price</p>
                    <p className="text-white text-lg font-semibold">₱{movieDetails.price}</p>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={() => setShowSchedules(true)}
                  disabled={!hasSchedules}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {hasSchedules ? (isAdmin ? "View Schedules" : "Book Now") : "No Schedules Available"}
                </button>
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
                  Choose your preferred showtime for <span className="text-white font-semibold">{movieDetails.title}</span>
                </p>
              </div>

              {/* Schedule Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {hasSchedules ? (
                  movieSchedules.map((schedule, index) => {
                    const info = getScheduleDisplayInfo(schedule, index);
                    return (
                      <button
                        key={index}
                        onClick={() => !isAdmin && onSelectSchedule(info.value)}
                        disabled={isAdmin}
                        className={`group relative px-6 py-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl font-medium border-2 transition-all duration-300 overflow-hidden ${
                          isAdmin
                            ? "border-gray-700 cursor-default opacity-75"
                            : "border-gray-700 hover:border-red-500 hover:scale-105"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:to-red-500/10 transition-all duration-300"></div>
                        <div className="relative z-10 space-y-2">
                          <div className="text-xs text-gray-400 uppercase tracking-wider">
                            🎬 {info.cinema}
                          </div>
                          <div className="text-sm text-gray-300">
                            {info.date}
                          </div>
                          <div className="text-2xl font-bold text-red-400">
                            {info.time}
                          </div>
                          <div className="text-xs text-gray-500">
                            💺 {info.seats} seats
                          </div>
                        </div>
                        {!isAdmin && (
                          <svg className="absolute bottom-2 right-2 w-5 h-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-400 text-lg">No schedules available</p>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                {isAdmin ? (
                  <p className="text-sm text-gray-500">
                    View-only mode: Schedules are displayed for reference only
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Select a schedule to proceed to seat selection
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
          </>
        )}
      </div>
    </div>
  );
}