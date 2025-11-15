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
        className="w-full h-85 object-cover"
      />
      
    </div>
  );
}
