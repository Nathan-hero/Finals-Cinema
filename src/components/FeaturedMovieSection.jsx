// src/components/FeaturedMovieSection.jsx
import React from "react";

export default function FeaturedMovieSection({
  featured,
  featuredMovies,
  featuredIndex,
  isTransitioning,
  onNavigate,
  onSelectMovie,
}) {
  if (!featured) return null;

  return (
    <section className="relative h-[80vh] flex items-center text-white overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${featured.banner || featured.image || featured.poster})`,
          backgroundPosition: "center right",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      {/* Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={() =>
              onNavigate((featuredIndex - 1 + featuredMovies.length) % featuredMovies.length)
            }
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={() =>
              onNavigate((featuredIndex + 1) % featuredMovies.length)
            }
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-red-600 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ›
          </button>
        </>
      )}

      {/* Text */}
      <div
        className={`relative z-10 px-10 lg:px-20 max-w-2xl transition-all duration-700 ${
          isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="text-red-500 font-semibold mb-2">Featured</p>
        <h1 className="text-6xl font-extrabold mb-4 uppercase">{featured.title}</h1>
        <p className="text-gray-300 mb-6">
          {featured.about || featured.description || "No description available."}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => onSelectMovie(featured)}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-semibold transition"
          >
            Reserve Movie
          </button>
          <button className="bg-gray-600/70 hover:bg-gray-500 px-5 py-2 rounded-full font-semibold transition">
            More Details
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            disabled={isTransitioning}
            className={`h-3 rounded-full transition-all duration-500 ${
              i === featuredIndex ? "bg-white/90 w-8" : "bg-white/40 w-3"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
