import React, { useState, useEffect } from "react";
import moviesData from "../data/moviesData";
import MovieCard from "../components/MovieCard";
import SeatPicker from "../components/SeatPicker";
import { formatFriendly } from "../utils/format";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [bookings, setBookings] = useLocalStorage("cbs_bookings_v1", []);
  const [featured, setFeatured] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Pick a random featured movie on load DO NOT TOUCH
  useEffect(() => {
    setFeatured(moviesData[Math.floor(Math.random() * moviesData.length)]);
  }, []);

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

  const handleConfirmSeats = (seats) => {
    const booking = {
      id: `b_${Date.now()}`,
      movieId: selectedMovie.id,
      title: selectedMovie.title,
      schedule: selectedSchedule,
      seats,
      total: selectedMovie.price * seats.length,
    };
    setBookings([...bookings, booking]);
    setShowSeatPicker(false);
    alert(`Successfully booked ${seats.length} seat(s) for ${selectedMovie.title}`);
  };

  const scroll = (id, offset) =>
    document.getElementById(id)?.scrollBy({ left: offset, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🎬 FEATURED MOVIE SECTION */}
      {featured && (
        <section
          className="relative h-[80vh] flex items-center text-white"
          style={{
            background: `url(${featured.image}) center right / cover no-repeat`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="relative z-10 px-10 lg:px-20 max-w-2xl">
            <p className="text-red-500 font-semibold mb-2">Featured</p>
            <h1 className="text-6xl font-extrabold mb-4 uppercase">{featured.title}</h1>
            <p className="text-gray-300 mb-6">{featured.description || "No description available."}</p>

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
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === 0 ? "bg-white/80" : "bg-white/30"
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
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === f
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
                    className="ml-10 flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-bold text-xl mb-3">{selectedMovie.title}</h3>
            <div className="text-sm mb-4">
              Runtime: {selectedMovie.runtime} mins <br />
              Rating: {selectedMovie.rating} <br />
              Price: ₱{selectedMovie.price}
            </div>

            <h4 className="font-semibold mb-2">Select a Schedule:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedMovie.schedule.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSchedule(s);
                    setShowSeatPicker(true);
                  }}
                  className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
                >
                  {formatFriendly(s)}
                </button>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedMovie(null)}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
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
