// src/components/GenreMovieList.jsx
import React from "react";
import MovieCard from "./MovieCard";

export default function GenreMovieList({ genres, moviesData, onSelect }) {
  const scroll = (id, offset) =>
    document.getElementById(id)?.scrollBy({ left: offset, behavior: "smooth" });

  return (
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
