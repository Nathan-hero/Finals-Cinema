// ManageMovies.jsx
import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";
import AddMovieModal from "./AddMovieModal";
import EditMovieModal from "./EditMovieModal";
import RemoveMovieModal from "./RemoveMovieModal";
import RemoveMovieStatus from "./RemoveMovieStatus";
// Admin only access
// Summary of file: Component for managing movies in admin dashboard (add, edit, remove, list)

export default function ManageMovies() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // NEW Remove Movie modals
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showRemoveStatus, setShowRemoveStatus] = useState(false);
  const [removeStatusMessage, setRemoveStatusMessage] = useState("");
  const [removeStatusType, setRemoveStatusType] = useState("success");

  const [selectedMovieToEdit, setSelectedMovieToEdit] = useState(null);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const showRemoveStatusMessage = (msg, type = "success") => {
    setRemoveStatusMessage(msg);
    setRemoveStatusType(type);
    setShowRemoveStatus(true);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      const data = await adminAPI.getAllMovies();
      setMovies(data);
    } catch (err) {
      showRemoveStatusMessage("Error loading movies: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(index) {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
      return;
    }
    setSelectedIndexes([...selectedIndexes, index]);
  }

  function handleEditMovie() {
    if (selectedIndexes.length !== 1) return;
    const absoluteIndex = startIndex + selectedIndexes[0];
    const movieToEdit = filteredMovies[absoluteIndex];
    setSelectedMovieToEdit(movieToEdit);
    setShowEditModal(true);
  }

  function handleRemoveMovies() {
    if (selectedIndexes.length === 0) return;
    setShowRemoveConfirm(true);
  }

  async function confirmRemoveMovies() {
    const selectedMovieIds = selectedIndexes.map((index) => {
      const absoluteIndex = startIndex + index;
      return filteredMovies[absoluteIndex]._id;
    });

    try {
      await Promise.all(selectedMovieIds.map((id) => adminAPI.deleteMovie(id)));
      showRemoveStatusMessage(
        `Successfully deleted ${selectedIndexes.length} movie(s)!`,
        "success"
      );
      setSelectedIndexes([]);
      fetchMovies();
    } catch (err) {
      showRemoveStatusMessage(
        "Error deleting movies: " + err.message,
        "error"
      );
    }
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(movie.genre)
      ? movie.genre.join(", ")
      : movie.genre
    )
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const isEditEnabled = selectedIndexes.length === 1;
  const isRemoveEnabled = selectedIndexes.length >= 1;
  const isAddEnabled = selectedIndexes.length === 0;

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = filteredMovies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const atFirstPage = currentPage === 1;
  const atLastPage = currentPage === totalPages;

  if (loading) {
    return (
      <section className="bg-neutral-900 rounded-xl p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-3xl px-4">Manage Movies</h2>

      <div className="flex flex-wrap items-center justify-between px-4">
        <div className="flex flex-wrap space-x-8">
          <button
            onClick={() => isAddEnabled && setShowAddModal(true)}
            disabled={!isAddEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 ${
              isAddEnabled
                ? "bg-white text-black hover:bg-gray-200 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Add Movie
          </button>

          <button
            onClick={handleEditMovie}
            disabled={!isEditEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 ${
              isEditEnabled
                ? "bg-white text-black hover:bg-gray-200 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Edit Movie
          </button>

          <button
            onClick={handleRemoveMovies}
            disabled={!isRemoveEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 ${
              isRemoveEnabled
                ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Remove Movie
          </button>
        </div>

        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Movies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4 table-fixed">
          <thead className="border-b border-neutral-700 text-gray-300">
            <tr className="text-center">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Poster</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Genre</th>
              <th className="px-6 py-3">Date Added</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedMovies.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  {searchQuery ? "No movies found" : "No movies available"}
                </td>
              </tr>
            ) : (
              paginatedMovies.map((movie, i) => {
                const absoluteIndex = startIndex + i;
                return (
                  <tr
                    key={movie._id || absoluteIndex}
                    className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                  >
                    <td className="px-6 py-4">{absoluteIndex + 1}</td>

                    <td className="px-6 py-4">
                      <img
                        src={movie.posterURL}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-poster.jpg";
                        }}
                      />
                    </td>

                    <td className="px-6 py-4 text-white font-medium">
                      {movie.title}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {Array.isArray(movie.genre)
                        ? movie.genre.join(", ")
                        : movie.genre}
                    </td>

                    <td className="px-6 py-4">
                      {movie.createdAt
                        ? new Date(movie.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      {movie.updatedAt
                        ? new Date(movie.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedIndexes.includes(i)}
                          onChange={() => handleSelect(i)}
                          className="accent-red-500 w-5 h-5 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={atFirstPage}
          className={`${atFirstPage ? "text-gray-600" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor" />
            <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        <button
          onClick={() => !atFirstPage && setCurrentPage(currentPage - 1)}
          disabled={atFirstPage}
          className={`${atFirstPage ? "text-gray-600" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        <span className="text-sm text-gray-300">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => !atLastPage && setCurrentPage(currentPage + 1)}
          disabled={atLastPage}
          className={`${atLastPage ? "text-gray-600" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={atLastPage}
          className={`${atLastPage ? "text-gray-600" : "hover:text-white"}`}
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" />
            <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* MODALS */}
      <AddMovieModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onMovieAdded={fetchMovies}
      />

      <EditMovieModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMovieToEdit(null);
        }}
        movieData={selectedMovieToEdit}
        onMovieUpdated={() => {
          fetchMovies();
          setSelectedIndexes([]);
        }}
      />

      {/* NEW REMOVE MOVIE CONFIRMATION */}
      <RemoveMovieModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={confirmRemoveMovies}
        count={selectedIndexes.length}
      />

      {/* NEW REMOVE MOVIE STATUS MODAL */}
      <RemoveMovieStatus
        isOpen={showRemoveStatus}
        type={removeStatusType}
        message={removeStatusMessage}
        onClose={() => setShowRemoveStatus(false)}
      />
    </section>
  );
}
