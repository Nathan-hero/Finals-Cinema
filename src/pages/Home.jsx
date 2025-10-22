import React, { useState, useEffect } from "react";
import moviesData from "../data/moviesData";
import MovieCard from "../components/MovieCard";
import SeatPicker from "../components/SeatPicker";
import { formatFriendly } from "../utils/format";

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  // ✅ REMOVED: const [bookings, setBookings] = useLocalStorage("cbs_bookings_v1", []);
  const [featured, setFeatured] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Get all featured movies
  const featuredMovies = moviesData.filter((m) => m.featured);

  // Set initial featured movie
  useEffect(() => {
    if (featuredMovies.length > 0) {
      setFeatured(featuredMovies[0]);
      setFeaturedIndex(0);
    }
  }, []);

  // Smooth transition function
  const transitionToMovie = (index) => {
    if (index === featuredIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Fade out
    setTimeout(() => {
      setFeaturedIndex(index);
      setFeatured(featuredMovies[index]);
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-rotate featured movies every 5 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const interval = setInterval(() => {
      const nextIndex = (featuredIndex + 1) % featuredMovies.length;
      transitionToMovie(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredIndex, featuredMovies.length, isTransitioning]);

  // Handle manual navigation
  const goToFeatured = (index) => {
    transitionToMovie(index);
  };

  // Extract unique genres
  const genres = ["All", ...new Set(
    moviesData.flatMap(m =>
      Array.isArray(m.genre)
        ? m.genre
        : (m.genre || "").split(",").map(g => g.trim())
    )
  ).values()];

  // Filtered movies (for later expansion if needed)
  const filteredMovies = moviesData.filter(movie => {
    if (filter === "Featured") return movie.featured;
    if (filter === "Genre" && selectedGenre !== "All")
      return movie.genre?.includes(selectedGenre);
    return true;
  });

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setSelectedSchedule(null);
  };

  // ✅ FIXED: Just close the modal - SeatPicker already saved to database
  const handleConfirmSeats = () => {
    setShowSeatPicker(false);
    // Success alert is shown in SeatPicker.jsx after database save
  };

  const scroll = (id, offset) =>
    document.getElementById(id)?.scrollBy({ left: offset, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🎬 FEATURED MOVIE SECTION */}
      {featured && (
        <section className="relative h-[80vh] flex items-center text-white overflow-hidden">
          {/* Background Image with Smooth Transition */}
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${featured.banner || featured.image || featured.poster})`,
              backgroundPosition: "center right",
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          
          {/* Navigation Arrows */}
          {featuredMovies.length > 1 && (
            <>
              <button
                onClick={() => goToFeatured((featuredIndex - 1 + featuredMovies.length) % featuredMovies.length)}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goToFeatured((featuredIndex + 1) % featuredMovies.length)}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Content with Smooth Transition */}
          <div
            className={`relative z-10 px-10 lg:px-20 max-w-2xl transition-all duration-700 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <p className="text-red-500 font-semibold mb-2">Featured</p>
            <h1 className="text-6xl font-extrabold mb-4 uppercase">{featured.title}</h1>
            <p className="text-gray-300 mb-6">{featured.about || featured.description || "No description available."}</p>

            <div className="flex items-center gap-3 text-gray-400 text-sm mb-6">
              <span>{featured.year || "2022"}</span>
              <span className="border border-gray-500 rounded px-2 py-[2px] text-xs">
                {featured.rating || "G"}
              </span>
              <span>{Array.isArray(featured.genre) ? featured.genre.join(", ") : featured.genre}</span>
              <span>{featured.runtime ? `${featured.runtime} mins` : "2 hours 10 minutes"}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSelectMovie(featured)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-semibold transition"
              >
                Reserve Movie
              </button>
              <button className="bg-gray-600/70 hover:bg-gray-500 px-5 py-2 rounded-full font-semibold transition">
                More Details
              </button>
            </div>
          </div>
          
          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {featuredMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => goToFeatured(i)}
                disabled={isTransitioning}
                className={`h-3 rounded-full transition-all duration-500 disabled:cursor-not-allowed ${
                  i === featuredIndex ? "bg-white/90 w-8" : "bg-white/40 hover:bg-white/60 w-3"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* 🎥 FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 px-6 lg:px-10 py-4 bg-black">
        {["All", "Featured"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setSelectedGenre("All");
            }}
            className={`px-4 py-2 rounded-full font-medium transition ${filter === f
              ? "bg-red-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
          >
            {f}
          </button>
        ))}

        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setFilter("Genre");
          }}
          className="px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 cursor-pointer"
        >
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* 🎥 NOW SHOWING GRID */}
      <div className="p-6 lg:p-10 space-y-10">
        {genres
          .filter((g) => g !== "All")
          .map((genre) => {
            const moviesInGenre = moviesData.filter((m) =>
              (Array.isArray(m.genre)
                ? m.genre
                : (m.genre || "").split(",").map((g) => g.trim())
              ).includes(genre)
            );

            if (!moviesInGenre.length) return null;

            const scrollId = `scroll-${genre}`;

            return (
              <div key={genre}>
                <h2 className="text-3xl font-bold mb-4 capitalize">{genre}</h2>
                <div className="relative">
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-red-600 z-10"
                    onClick={() => scroll(scrollId, -400)}
                  >
                    ‹
                  </button>
                  <div
                    id={scrollId}
                    className="ml-10 mr-10 flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
                  >
                    {moviesInGenre.map((movie) => (
                      <div key={movie.id} className="flex-none w-[220px]">
                        <MovieCard movie={movie} onSelect={handleSelectMovie} />
                      </div>
                    ))}
                  </div>
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-red-600 z-10"
                    onClick={() => scroll(scrollId, 400)}
                  >
                    ›
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* 🎟️ MOVIE DETAILS MODAL */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-700/50 animate-scale-in">

            {/* Close Button - Floating Top Right */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-red-600 rounded-full transition-all duration-300 backdrop-blur-sm group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Cinematic Banner Section */}
            {selectedMovie.banner && (
              <div className="relative w-full h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
                <img
                  src={selectedMovie.banner}
                  alt={`${selectedMovie.title} Banner`}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                {/* Title on Banner */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-2xl tracking-tight">
                    {selectedMovie.title}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Main Content: Poster + Details */}
            <div className="grid md:grid-cols-3 gap-6 p-6">

              {/* Poster */}
              <div className="md:col-span-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-full h-auto object-cover rounded-xl shadow-2xl border-2 border-gray-700/50 transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 flex flex-col justify-between space-y-4">

                {/* Genre Tags */}
                {selectedMovie.genre && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genre.split(',').map((g, i) => (
                      <span key={i} className="px-4 py-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 text-sm rounded-full border border-gray-600 hover:border-red-500 transition-colors duration-300">
                        {g.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* About */}
                {selectedMovie.about && (
                  <p className="text-gray-300 leading-relaxed text-base">
                    {selectedMovie.about}
                  </p>
                )}

                {/* Movie Info Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Runtime</p>
                    <p className="text-white text-lg font-semibold">{selectedMovie.runtime} mins</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rating</p>
                    <p className="text-white text-lg font-semibold">{selectedMovie.rating}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-xl border border-red-700/50 hover:border-red-500 transition-colors duration-300">
                    <p className="text-red-200 text-xs uppercase tracking-wider mb-1">Price</p>
                    <p className="text-white text-lg font-semibold">₱{selectedMovie.price}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Select a Schedule:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedMovie.schedule.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSchedule(s);
                          setShowSeatPicker(true);
                        }}
                        className="relative px-6 py-4 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 overflow-hidden group"
                      >
                        <span className="relative z-10">{formatFriendly(s)}</span>
                        <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Gradient Bar */}
            <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
          </div>
        </div>
      )}

      {/* 🎫 SEAT PICKER */}
      <SeatPicker
        show={showSeatPicker}
        onClose={() => setShowSeatPicker(false)}
        movie={selectedMovie}
        selectedSchedule={selectedSchedule}
        onConfirm={handleConfirmSeats}
      />
    </div>
  );
}