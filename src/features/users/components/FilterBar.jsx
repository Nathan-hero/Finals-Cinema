// src/components/FilterBar.jsx
import React from "react";
// User access (Admin can use this section as well)
// Summary of file: This component provides a filter bar for users to filter movies by category or genre.
export default function FilterBar({
  filter,
  setFilter,
  selectedGenre,
  setSelectedGenre,
  genres,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 px-6 lg:px-10 py-8 bg-black">
      {["All", "Featured"].map((f) => (
        <button
          key={f}
          onClick={() => {
            setFilter(f);
            setSelectedGenre("All");
          }}
          className={`px-5 py-2 rounded-full font-medium text-sm border transition
            ${filter === f
              ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
              : "bg-[#1a1a1a] border-white text-white hover:bg-gray-700"
            }`}
        >
          {f}
        </button>
      ))}

      <div className="relative">
        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setFilter("Genre");
          }}
          className="appearance-none px-5 py-2 rounded-full bg-[#1a1a1a] border border-white text-white text-sm cursor-pointer hover:bg-gray-700 pr-10"
        >
          {genres.map((g) => (
            <option key={g} className="bg-black text-white">{g}</option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}
