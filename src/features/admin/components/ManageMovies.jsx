import React, { useState } from "react";
import moviesData from "../../../shared/data/moviesData";
import AddMovieModal from "./AddMovieModal";

export default function ManageMovies() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [movies, setMovies] = useState(moviesData);

  // Tracks which rows are selected
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  // Checkbox handler (allows multi-select)
  function handleSelect(index) {
    // If already selected → remove from selection
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
      return;
    }

    // Add selection (multi-select allowed)
    setSelectedIndexes([...selectedIndexes, index]);
  }

  // Button validation
  const isEditEnabled = selectedIndexes.length === 1;     // exactly 1
  const isRemoveEnabled = selectedIndexes.length >= 1;    // 1 or more

  // ===========================
  // 🔥 PAGINATION
  // ===========================
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const atFirstPage = currentPage === 1;
  const atLastPage = currentPage === totalPages;

  return (
    <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-3xl px-4">Manage Movies</h2>

      <div className="flex flex-wrap items-center justify-between px-4">
        <div className="flex flex-wrap space-x-8">

          {/* Add Movie */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44"
          >
            Add Movie
          </button>

          <AddMovieModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
          />

          {/* EDIT MOVIE — enabled only if EXACTLY 1 selected */}
          <button
            disabled={!isEditEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44
              ${isEditEnabled
                ? "bg-white text-black hover:bg-gray-200 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
          >
            Edit Movie
          </button>

          {/* REMOVE MOVIE — enabled if 1 or more selected */}
          <button
            disabled={!isRemoveEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 
              ${isRemoveEnabled
                ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
          >
            Remove Movie
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Movies"
            className="w-full bg-white text-black text-sm rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:ring-2 focus:ring-red-600"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" />
              <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2" />
            </svg>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4 table-fixed">
          <thead className="border-b border-neutral-700 text-gray-300">
            <tr className="text-center">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Title</th>
              {/* <th className="px-6 py-3">Featured</th> */}
              <th className="px-6 py-3">Date Added</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {paginatedMovies.map((movie, i) => {
              const absoluteIndex = startIndex + i;

              return (
                <tr
                  key={movie._id || absoluteIndex}
                  className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                >
                  <td className="px-6 py-4">{absoluteIndex + 1}</td>
                  <td className="px-6 py-4">{movie.title}</td>
                  {/* <td className="px-6 py-4">{movie.featured ? "Yes" : "No"}</td> */}
                  <td className="px-6 py-4">
                    {movie.dateAdded ? new Date(movie.dateAdded).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {movie.lastUpdated ? new Date(movie.lastUpdated).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selectedIndexes.includes(absoluteIndex)}
                        onChange={() => handleSelect(absoluteIndex)}
                        className="accent-red-500 w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* Pagination centered under the table */}
      <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">

        {/* FIRST PAGE */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={atFirstPage}
          className={`${atFirstPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor" />
            <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        {/* PREVIOUS PAGE */}
        <button
          onClick={() => !atFirstPage && setCurrentPage(currentPage - 1)}
          disabled={atFirstPage}
          className={`${atFirstPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        <span className="text-sm text-gray-300">
          Page {currentPage} of {totalPages}
        </span>

        {/* NEXT PAGE */}
        <button
          onClick={() => !atLastPage && setCurrentPage(currentPage + 1)}
          disabled={atLastPage}
          className={`${atLastPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        {/* LAST PAGE */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={atLastPage}
          className={`${atLastPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" />
            <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

      </div>

    </section>
  );
}
