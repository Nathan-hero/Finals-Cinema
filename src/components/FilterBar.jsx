// src/components/FilterBar.jsx
import React from "react";

export default function FilterBar({
  filter,
  setFilter,
  selectedGenre,
  setSelectedGenre,
  genres,
}) {
  return (
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
  );
}
