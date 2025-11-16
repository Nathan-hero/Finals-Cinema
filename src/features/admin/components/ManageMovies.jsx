import React, { useState } from "react";
import moviesData from "../../../shared/data/moviesData";
import AddMovieModal from "./AddMovieModal";

export default function ManageMovies() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [movies, setMovies] = useState(moviesData);

  const [selectedIndexes, setSelectedIndexes] = useState([]);

  function handleSelect(index) {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
      return;
    }
    setSelectedIndexes([...selectedIndexes, index]);
  }

  const isEditEnabled = selectedIndexes.length === 1;
  const isRemoveEnabled = selectedIndexes.length >= 1;

  // Pagination logic
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  // Movies for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  // Button states
  const atFirstPage = currentPage === 1;
  const atLastPage = currentPage === totalPages;

  return (
    <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-3xl px-4">Manage Movies</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4 table-fixed">
          <thead className="border-b border-neutral-700 text-gray-300">
            <tr className="text-center">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Title</th>
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

                  <td className="px-6 py-4">
                    {movie.dateAdded
                      ? new Date(movie.dateAdded).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    {movie.lastUpdated
                      ? new Date(movie.lastUpdated).toLocaleDateString()
                      : "—"}
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

      {/* Pagination section */}
      <div className="flex justify-center items-center space-x-4 mt-4">

        {/* FIRST PAGE */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={atFirstPage}
          className={`${atFirstPage ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white"}`}
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
          className={`${atFirstPage ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white"}`}
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
          className={`${atLastPage ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        {/* LAST PAGE */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={atLastPage}
          className={`${atLastPage ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white"}`}
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
