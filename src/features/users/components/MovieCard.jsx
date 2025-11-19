import React from "react";
// User access (Admin can see this section as well)
// Summary of file: This component displays a movie card with poster and title, allowing users to select a movie for more details.

export default function MovieCard({ movie, onSelect }) {
  return (
    <div
      onClick={() => onSelect?.(movie)}
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
