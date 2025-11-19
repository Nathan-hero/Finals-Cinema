import React from "react";
import MovieCard from "./MovieCard";
// User access (Admin can see this section as well)
// Summary of file: This component displays a list of movies categorized by genre, with filtering and search capabilities.

export default function GenreMovieList({ genres, moviesData, onSelect, filter, selectedGenre, searchQuery }) {
  const scroll = (id, offset) =>
    document.getElementById(id)?.scrollBy({ left: offset, behavior: "smooth" });

  // Filter genres based on current filter state
  const getGenresToShow = () => {
    if (filter === "Search") {
      return []; // Don't show genre sections when searching
    }
    if (filter === "Genre" && selectedGenre !== "All") {
      return [selectedGenre];
    }
    if (filter === "Featured") {
      return ["Featured"];
    }
    return genres.filter((g) => g !== "All");
  };

  // Get movies to show based on filter and genre
  const getMoviesToShow = (genre) => {
    let movies = [];

    if (filter === "Featured" && genre === "Featured") {
      movies = moviesData.filter((m) => m.featured);
    } else {
      // Handle both array and string genre formats from backend
      movies = moviesData.filter((m) => {
        const movieGenres = Array.isArray(m.genre)
          ? m.genre
          : (m.genre || "").split(",").map((g) => g.trim());
        
        return movieGenres.includes(genre);
      });
    }

    // Apply search filter if there's a search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      movies = movies.filter((movie) => {
        const movieGenres = Array.isArray(movie.genre) 
          ? movie.genre.join(", ") 
          : movie.genre;
        
        return movie.title.toLowerCase().includes(query) ||
          movieGenres.toLowerCase().includes(query) ||
          (movie.about && movie.about.toLowerCase().includes(query)) ||
          (movie.description && movie.description.toLowerCase().includes(query));
      });
    }

    return movies;
  };

  const genresToShow = getGenresToShow();

  // If there's a search query, show search results instead of genre sections
  if (searchQuery && searchQuery.trim() && filter === "Search") {
    const searchResults = moviesData.filter((movie) => {
      const query = searchQuery.toLowerCase().trim();
      const movieGenres = Array.isArray(movie.genre) 
        ? movie.genre.join(", ") 
        : movie.genre;
      
      return movie.title.toLowerCase().includes(query) ||
        movieGenres.toLowerCase().includes(query) ||
        (movie.about && movie.about.toLowerCase().includes(query)) ||
        (movie.description && movie.description.toLowerCase().includes(query));
    });

    return (
      <div className="p-6 lg:p-10">
        <h2 className="text-3xl font-bold mb-4">
          Search Results for "{searchQuery}" ({searchResults.length} found)
        </h2>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((movie) => (
              <div key={movie.id} className="flex-none">
                <MovieCard movie={movie} onSelect={onSelect} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found matching your search.</p>
            <p className="text-gray-500 text-sm mt-2">Try searching for a different title, genre, or keyword.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10">
      {genresToShow.map((genre) => {
        const moviesInGenre = getMoviesToShow(genre);

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
                    <MovieCard movie={movie} onSelect={onSelect} />
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
  );
}