// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import moviesData from "../../../shared/data/moviesData";
import SeatPicker from "../components/SeatPicker";
import FeaturedMovieSection from "../components/FeaturedMovieSection";
import FilterBar from "../components/FilterBar";
import GenreMovieList from "../components/GenreMovieList";
import MovieDetailsModal from "../components/MovieDetailsModal";
import useFeaturedMovies from "../../../shared/hooks/useFeaturedMovies";
import useGenres from "../../../shared/hooks/useGenres";
import { moviesAPI } from "../../../utils/api";

export default function Home({ searchQuery, movies: propMovies, user, isAdminView }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [movies, setMovies] = useState(propMovies || moviesData);
  const [loading, setLoading] = useState(!propMovies);
  const [error, setError] = useState(null);

  // Fetch movies from API if not provided as prop
  useEffect(() => {
    if (propMovies) {
      setMovies(propMovies);
      setLoading(false);
      return;
    }

    async function fetchMovies() {
      try {
        setLoading(true);
        const backendMovies = await moviesAPI.getAllMovies();

        // Map backend fields to frontend format
        const mappedMovies = backendMovies.map((movie) => ({
          id: movie._id,
          title: movie.title,
          genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
          runtime: movie.duration,
          rating: movie.movieRating,
          price: 210, // Default price, you can add this to backend if needed
          featured: movie.featured || false,
          schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"], // Default schedule, you can add this to backend if needed
          about: movie.description,
          poster: movie.posterURL,
          banner: movie.bannerURL,
        }));

        // Merge backend movies into fallback data by title
        const fallbackByTitle = new Map(
          moviesData.map((movie) => [movie.title.toLowerCase(), movie])
        );
        const backendByTitle = new Map(
          mappedMovies.map((movie) => [movie.title.toLowerCase(), movie])
        );

        const mergedMovies = moviesData.map((fallbackMovie) => {
          const backendMatch = backendByTitle.get(fallbackMovie.title.toLowerCase());
          if (backendMatch) {
            return {
              ...fallbackMovie,
              ...backendMatch,
            };
          }
          return fallbackMovie;
        });

        mappedMovies.forEach((backendMovie) => {
          if (!fallbackByTitle.has(backendMovie.title.toLowerCase())) {
            mergedMovies.push(backendMovie);
          }
        });

        setMovies(mergedMovies);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies");
        // Fallback to static data if API fails
        setMovies(moviesData);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [propMovies]);

  // Reset filter when search query changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setFilter("Search");
    } else if (filter === "Search") {
      setFilter("All");
    }
  }, [searchQuery, filter]);

  const {
    featuredMovies,
    featured,
    featuredIndex,
    isTransitioning,
    transitionToMovie,
  } = useFeaturedMovies(movies);

  const genres = useGenres(movies);

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

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-400">Loading movies...</p>
        </div>
      ) : error && movies.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <GenreMovieList
          genres={genres}
          moviesData={movies}
          onSelect={setSelectedMovie}
          filter={filter}
          selectedGenre={selectedGenre}
          searchQuery={searchQuery}
        />
      )}

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectSchedule={(schedule) => {
          setSelectedSchedule(schedule);
          setShowSeatPicker(true);
        }}
        isAdmin={user?.role === "admin" || isAdminView}
      />

      <SeatPicker
        show={showSeatPicker}
        onClose={() => setShowSeatPicker(false)}
        movie={selectedMovie}
        selectedSchedule={selectedSchedule}
        onConfirm={handleConfirmSeats}
        isAdmin={user?.role === "admin" || isAdminView}
      />
    </div>
  );
}
