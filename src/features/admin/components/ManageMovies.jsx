import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";
import AddMovieModal from "./AddMovieModal";
import EditMovieModal from "./EditMovieModal";

// Success/Error Modal Component
function NotificationModal({ isOpen, onClose, message, type = "success" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50">
        <div className="p-8 text-center">
          <div className={`mx-auto w-20 h-20 ${type === "success" ? "bg-green-500/20" : "bg-red-500/20"} rounded-full flex items-center justify-center mb-4`}>
            <svg className={`w-10 h-10 ${type === "success" ? "text-green-500" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">{type === "success" ? "Success!" : "Error"}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <button onClick={onClose} className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:from-red-500 hover:to-red-400 transition-all duration-300">Close</button>
        </div>
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>
    </div>
  );
}

// Confirmation Modal Component
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50">
        <div className="p-8">
          <div className="mx-auto w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-center">{title}</h3>
          <p className="text-gray-300 mb-6 text-center">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-all duration-300">{cancelText}</button>
            <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:from-red-500 hover:to-red-400 transition-all duration-300">{confirmText}</button>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
      </div>
    </div>
  );
}

export default function ManageMovies() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [selectedMovieToEdit, setSelectedMovieToEdit] = useState(null);
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      const data = await adminAPI.getAllMovies();
      setMovies(data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      showNotificationMessage("Error loading movies: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function showNotificationMessage(message, type = "success") {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  }

  function handleSelect(index) {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
      return;
    }
    setSelectedIndexes([...selectedIndexes, index]);
  }

  // Handle Edit Movie
  function handleEditMovie() {
    if (selectedIndexes.length !== 1) return;
    const absoluteIndex = startIndex + selectedIndexes[0];
    const movieToEdit = filteredMovies[absoluteIndex];
    setSelectedMovieToEdit(movieToEdit);
    setShowEditModal(true);
  }

  // Handle Remove Movies
  async function confirmRemoveMovies() {
    const selectedMovieIds = selectedIndexes.map(index => {
      const absoluteIndex = startIndex + index;
      return filteredMovies[absoluteIndex]._id;
    });

    try {
      await Promise.all(selectedMovieIds.map(id => adminAPI.deleteMovie(id)));
      showNotificationMessage(`Successfully deleted ${selectedIndexes.length} movie(s)!`, "success");
      setSelectedIndexes([]);
      fetchMovies();
    } catch (err) {
      showNotificationMessage("Error deleting movies: " + err.message, "error");
    }
  }

  function handleRemoveMovies() {
    if (selectedIndexes.length === 0) return;
    setShowConfirmModal(true);
  }

  // Filter movies by search
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Button validation
  const isEditEnabled = selectedIndexes.length === 1;
  const isRemoveEnabled = selectedIndexes.length >= 1;
  const isAddEnabled = selectedIndexes.length === 0;

  // PAGINATION
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);
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
          <button onClick={() => isAddEnabled && setShowAddModal(true)} disabled={!isAddEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 ${isAddEnabled ? "bg-white text-black hover:bg-gray-200 cursor-pointer" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}>
            Add Movie
          </button>

          <button onClick={handleEditMovie} disabled={!isEditEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 ${isEditEnabled ? "bg-white text-black hover:bg-gray-200 cursor-pointer" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}>
            Edit Movie
          </button>

          <button onClick={handleRemoveMovies} disabled={!isRemoveEnabled}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 ${isRemoveEnabled ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}>
            Remove Movie
          </button>
        </div>

        <div className="relative w-96">
          <input type="text" placeholder="Search Movies" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black text-sm rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:ring-2 focus:ring-red-600" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" />
              <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2" />
            </svg>
          </span>
        </div>
      </div>

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
              <tr><td colSpan="7" className="text-center py-8 text-gray-400">{searchQuery ? "No movies found" : "No movies available"}</td></tr>
            ) : (
              paginatedMovies.map((movie, i) => {
                const absoluteIndex = startIndex + i;
                return (
                  <tr key={movie._id || absoluteIndex} className="border-b border-neutral-800 hover:bg-neutral-800 text-center">
                    <td className="px-6 py-4">{absoluteIndex + 1}</td>
                    <td className="px-6 py-4">
                      <img src={movie.posterURL} alt={movie.title} className="w-12 h-16 object-cover rounded mx-auto"
                        onError={(e) => { e.currentTarget.src = "/placeholder-poster.jpg"; }} />
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{movie.title}</td>
                    <td className="px-6 py-4 text-gray-300">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</td>
                    <td className="px-6 py-4">{movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-4">{movie.updatedAt ? new Date(movie.updatedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <input type="checkbox" checked={selectedIndexes.includes(i)} onChange={() => handleSelect(i)} className="accent-red-500 w-5 h-5 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
        <button onClick={() => setCurrentPage(1)} disabled={atFirstPage} className={`${atFirstPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor" />
            <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>
        <button onClick={() => !atFirstPage && setCurrentPage(currentPage - 1)} disabled={atFirstPage} className={`${atFirstPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor" /></svg>
        </button>
        <span className="text-sm text-gray-300">Page {currentPage} of {totalPages || 1}</span>
        <button onClick={() => !atLastPage && setCurrentPage(currentPage + 1)} disabled={atLastPage} className={`${atLastPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" /></svg>
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={atLastPage} className={`${atLastPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}`}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
            <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor" />
            <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Modals */}
      <AddMovieModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onMovieAdded={fetchMovies} />
      
      <EditMovieModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedMovieToEdit(null); }}
        movieData={selectedMovieToEdit} onMovieUpdated={() => { fetchMovies(); setSelectedIndexes([]); }} />

      <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={confirmRemoveMovies}
        title="Delete Movies" message={`Are you sure you want to delete ${selectedIndexes.length} movie(s)? This action cannot be undone.`}
        confirmText="Delete" cancelText="Cancel" />

      <NotificationModal isOpen={showNotification} onClose={() => setShowNotification(false)} message={notificationMessage} type={notificationType} />
    </section>
  );
}