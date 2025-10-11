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

  useEffect(() => {
    const random = moviesData[Math.floor(Math.random() * moviesData.length)];
    setFeatured(random);
  }, []);

  function handleSelectMovie(movie) {
    setSelectedMovie(movie);
    setSelectedSchedule(null);
  }

  function handleConfirmSeats(seats) {
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
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🎬 FEATURED MOVIE SECTION */}
      {featured && (
        <section
          className="relative h-[80vh] flex items-center justify-start"
          style={{
            backgroundImage: `url(${featured.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        >
          {/* Black radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0.90)_70%,_rgba(0,0,0,1)_100%)]"></div>

          {/* Content container */}
          <div className="relative z-10 px-10 lg:px-20 max-w-2xl">
            <p className="text-red-500 text-xl font-semibold mb-3">Featured</p>
            <h1 className="text-5xl font-extrabold mb-4">{featured.title}</h1>
            <p className="text-gray-200 leading-relaxed mb-6">
              {featured.description ||
                "Smart, sarcastic, and a little dead inside. This featured movie invites you into a thrilling mystery filled with humor and suspense."}
            </p>

            <div className="flex flex-wrap gap-4 text-gray-300 text-sm mb-8">
              <span className="bg-gray-700/50 px-3 py-1 rounded-full">⭐ {featured.rating}</span>
              <span className="bg-gray-700/50 px-3 py-1 rounded-full">
                ⏱ {featured.runtime} mins
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSelectMovie(featured)}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition"
              >
                Reserve Movie
              </button>
              <button className="bg-gray-700/80 hover:bg-gray-600 px-6 py-2 rounded-full font-semibold transition">
                More Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🎥 NOW SHOWING GRID */}
      <div className="p-6 lg:p-10">
        <h2 className="text-3xl font-bold mb-6 text-white">Now Showing</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {moviesData.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
          ))}
        </div>
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
            <div>
              <h4 className="font-semibold mb-2">Select a Schedule:</h4>
              <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="mt-6 text-right">
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
