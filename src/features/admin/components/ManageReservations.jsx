import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";

import EditReservationModal from "./EditReservationModal";
import EditReservationStatus from "./EditReservationStatus"; // USED NOW
import RemoveReservationModal from "./RemoveReservationModal";

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // STATUS MODAL (NOW USING EditReservationStatus)
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusType, setStatusType] = useState("success");
  const [statusMessage, setStatusMessage] = useState("");

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      setLoading(true);
      const data = await adminAPI.getAllReservations();
      setReservations(data);
    } catch (err) {
      setStatusType("error");
      setStatusMessage("Error loading reservations: " + err.message);
      setStatusOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(index) {
    setSelectedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  }

  function handleEditReservation() {
    if (selectedIndexes.length !== 1) return;

    const absoluteIndex = startIndex + selectedIndexes[0];
    const reservation = filteredReservations[absoluteIndex];

    setEditingReservation({
      ...reservation,
      seats: reservation.seats?.join(", ") || "",
    });

    setShowEditModal(true);
  }

  async function handleSaveEdit() {
    if (!editingReservation) return;

    try {
      const seatsArray = editingReservation.seats
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await adminAPI.updateReservation(editingReservation._id, {
        movieTitle: editingReservation.movieTitle,
        showtime: editingReservation.showtime,
        seats: seatsArray,
        totalPrice: editingReservation.totalPrice,
        status: editingReservation.status,
      });

      setStatusType("success");
      setStatusMessage("Reservation updated successfully!");
      setStatusOpen(true);

      setShowEditModal(false);
      setEditingReservation(null);
      setSelectedIndexes([]);
      fetchReservations();
    } catch (err) {
      setStatusType("error");
      setStatusMessage("Error updating reservation: " + err.message);
      setStatusOpen(true);
    }
  }

  function handleRemoveReservations() {
    if (selectedIndexes.length === 0) return;
    setShowRemoveModal(true);
  }

  async function confirmDeleteReservations() {
    const ids = selectedIndexes.map((index) => {
      const absoluteIndex = startIndex + index;
      return filteredReservations[absoluteIndex]._id;
    });

    try {
      await Promise.all(ids.map((id) => adminAPI.deleteReservation(id)));

      setStatusType("success");
      setStatusMessage("Reservations deleted successfully!");
      setStatusOpen(true);

      setSelectedIndexes([]);
      setShowRemoveModal(false);
      fetchReservations();
    } catch (err) {
      setStatusType("error");
      setStatusMessage("Error deleting reservations: " + err.message);
      setStatusOpen(true);
    }
  }

  const filteredReservations = reservations.filter((reservation) =>
    reservation.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedReservations = filteredReservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const isEditEnabled = selectedIndexes.length === 1;
  const isRemoveEnabled = selectedIndexes.length >= 1;

  if (loading) {
    return (
      <section className="bg-neutral-900 rounded-xl p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reservations...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-3xl px-4">Manage Reservations</h2>

        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex space-x-8">

            <button
              onClick={handleEditReservation}
              disabled={!isEditEnabled}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44
                ${
                  isEditEnabled
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
              Edit Reservation
            </button>

            <button
              onClick={handleRemoveReservations}
              disabled={!isRemoveEnabled}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44
                ${
                  isRemoveEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
              Remove Reservation
            </button>
          </div>

          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Reservations"
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-white text-black text-sm rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
              <svg width="18" height="18" fill="none">
                <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" />
                <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2" />
              </svg>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4 table-fixed">
            <thead className="border-b border-neutral-700 text-white">
              <tr className="text-center">
                <th className="py-4">#</th>
                <th className="py-4 text-left">User</th>
                <th className="py-4 text-left">Email</th>
                <th className="py-4 text-left">Movie</th>
                <th className="py-4">Seats</th>
                <th className="py-4">Date Reserved</th>
                <th className="py-4"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    {searchQuery ? "No reservations found" : "No reservations available"}
                  </td>
                </tr>
              ) : (
                paginatedReservations.map((r, i) => {
                  const absoluteIndex = startIndex + i;

                  return (
                    <tr
                      key={r._id}
                      className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                    >
                      <td className="py-4 text-white">{absoluteIndex + 1}</td>

                      <td className="py-4 text-white text-left">
                        {r.userId?.name || "Unknown User"}
                      </td>

                      <td className="py-4 text-gray-300 text-left">
                        {r.userId?.email || "N/A"}
                      </td>

                      <td className="py-4 text-white text-left">
                        {r.movieTitle || "Unknown Movie"}
                      </td>

                      <td className="py-4 text-white">
                        {r.seats?.join(", ") || "N/A"}
                      </td>

                      <td className="py-4 text-white">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={selectedIndexes.includes(i)}
                          onChange={() => handleSelect(i)}
                          className="accent-red-500 w-5 h-5 cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" />
              <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" />
            </svg>
          </button>

          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" />
              <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" />
            </svg>
          </button>
        </div>
      </section>

      {/* EDIT MODAL */}
      <EditReservationModal
        isOpen={showEditModal}
        reservation={editingReservation}
        setReservation={setEditingReservation}
        onSave={handleSaveEdit}
        onClose={() => {
          setShowEditModal(false);
          setEditingReservation(null);
        }}
      />

      {/* REMOVE CONFIRM MODAL */}
      <RemoveReservationModal
        isOpen={showRemoveModal}
        count={selectedIndexes.length}
        onConfirm={confirmDeleteReservations}
        onClose={() => setShowRemoveModal(false)}
      />

      {/* STATUS MODAL — NOW USING EDIT MODAL */}
      <EditReservationStatus
        isOpen={statusOpen}
        type={statusType}
        message={statusMessage}
        onClose={() => setStatusOpen(false)}
      />
    </>
  );
}
