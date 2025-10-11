import React from "react";

export default function MovieCard({ movie, onSelect }) {
  return (
    <div
      onClick={() => onSelect(movie)}
      className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer overflow-hidden transition"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        <p className="text-sm text-gray-600">
          {movie.runtime} mins | Rated {movie.rating}
        </p>
        <p className="mt-2 font-semibold text-slate-700">
          ₱{movie.price}
        </p>
      </div>
    </div>
  );
}
