// src/pages/Home.jsx
import React, { useState } from "react";
import moviesData from "../data/moviesData";
import SeatPicker from "../components/SeatPicker";
import FeaturedMovieSection from "../components/FeaturedMovieSection";
import FilterBar from "../components/FilterBar";
import GenreMovieList from "../components/GenreMovieList";
import MovieDetailsModal from "../components/MovieDetailsModal";
import useFeaturedMovies from "../hooks/useFeaturedMovies";
import useGenres from "../hooks/useGenres";

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const {
    featuredMovies,
    featured,
    featuredIndex,
    isTransitioning,
    transitionToMovie,
  } = useFeaturedMovies(moviesData);

  const genres = useGenres(moviesData);

  const handleConfirmSeats = () => {
    setShowSeatPicker(false);
    setSelectedMovie(null); // Close the movie modal
    setSelectedSchedule(null); // Reset schedule
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FeaturedMovieSection
        featured={featured}
        featuredMovies={featuredMovies}
        featuredIndex={featuredIndex}
        isTransitioning={isTransitioning}
        onNavigate={transitionToMovie}
        onSelectMovie={setSelectedMovie}
      />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres}
      />

      <GenreMovieList
        genres={genres}
        moviesData={moviesData}
        onSelect={setSelectedMovie}
      />

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectSchedule={(schedule) => {
          setSelectedSchedule(schedule);
          setShowSeatPicker(true);
        }}
      />

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
