import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";
import EditUserModal from "./EditUserModal";
import RemoveUserModal from "./RemoveUserModal";
import EditUserStatus from "./EditUserStatus";
import RemoveUserStatus from "./RemoveUserStatus";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // EDIT STATUS MODAL
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [editStatusType, setEditStatusType] = useState("success");
  const [editStatusMessage, setEditStatusMessage] = useState("");

  // REMOVE STATUS MODAL
  const [removeStatusOpen, setRemoveStatusOpen] = useState(false);
  const [removeStatusType, setRemoveStatusType] = useState("success");
  const [removeStatusMessage, setRemoveStatusMessage] = useState("");

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Users
  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      setRemoveStatusType("error");
      setRemoveStatusMessage("Error loading users: " + err.message);
      setRemoveStatusOpen(true);
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

  // Edit User
  function handleEditUser() {
    if (selectedIndexes.length !== 1) return;

    const absoluteIndex = startIndex + selectedIndexes[0];
    const user = filteredUsers[absoluteIndex];

    setEditingUser({ ...user });
    setShowEditModal(true);
  }

  async function handleSaveEdit() {
    if (!editingUser) return;

    try {
      await adminAPI.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
      });

      setEditStatusType("success");
      setEditStatusMessage("User updated successfully!");
      setEditStatusOpen(true);

      setShowEditModal(false);
      setEditingUser(null);
      setSelectedIndexes([]);
      fetchUsers();
    } catch (err) {
      setEditStatusType("error");
      setEditStatusMessage("Error updating user: " + err.message);
      setEditStatusOpen(true);
    }
  }

  // Remove Users
  function handleRemoveUsers() {
    if (selectedIndexes.length === 0) return;
    setShowDeleteModal(true);
  }

  async function confirmDeleteUsers() {
    const selectedUserIds = selectedIndexes.map((index) => {
      const absoluteIndex = startIndex + index;
      return filteredUsers[absoluteIndex]._id;
    });

    try {
      await Promise.all(selectedUserIds.map((id) => adminAPI.deleteUser(id)));

      setRemoveStatusType("success");
      setRemoveStatusMessage("Users deleted successfully!");
      setRemoveStatusOpen(true);

      setSelectedIndexes([]);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      setRemoveStatusType("error");
      setRemoveStatusMessage("Error deleting users: " + err.message);
      setRemoveStatusOpen(true);
    }
  }

  // Search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const atFirstPage = currentPage === 1;
  const atLastPage = currentPage === totalPages;

  const isEditEnabled = selectedIndexes.length === 1;
  const isRemoveEnabled = selectedIndexes.length >= 1;

  if (loading) {
    return (
      <section className="bg-neutral-900 rounded-xl p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-3xl px-4">Manage Users</h2>

        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex space-x-8">
            <button
              onClick={handleEditUser}
              disabled={!isEditEnabled}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 
                ${
                  isEditEnabled
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
              Edit User
            </button>

            <button
              onClick={handleRemoveUsers}
              disabled={!isRemoveEnabled}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 
                ${
                  isRemoveEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
              Remove User
            </button>
          </div>

          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-white text-black text-sm rounded-full pl-4 pr-9 py-2 border border-gray-300
                         focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
              <svg width="18" height="18" fill="none">
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
                <th className="py-4">#</th>
                <th className="py-4 text-left">Name</th>
                <th className="py-4 text-left">Email</th>
                <th className="py-4">Date Joined</th>
                <th className="py-4"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    {searchQuery ? "No users found" : "No users available"}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, i) => {
                  const absoluteIndex = startIndex + i;

                  return (
                    <tr
                      key={user._id || absoluteIndex}
                      className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                    >
                      <td className="py-4 text-white">{absoluteIndex + 1}</td>
                      <td className="py-4 text-left text-white">{user.name}</td>
                      <td className="py-4 text-left text-gray-300">{user.email}</td>
                      <td className="py-4 text-white">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-4">
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

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={atFirstPage}
            className={atFirstPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" />
              <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" />
            </svg>
          </button>

          <button
            onClick={() => !atFirstPage && setCurrentPage(currentPage - 1)}
            disabled={atFirstPage}
            className={atFirstPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" />
            </svg>
          </button>

          <span className="text-sm text-gray-300">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => !atLastPage && setCurrentPage(currentPage + 1)}
            disabled={atLastPage}
            className={atLastPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={atLastPage}
            className={atLastPage ? "text-gray-600 cursor-not-allowed" : "hover:text-white"}
          >
            <svg width="25" height="25" fill="currentColor">
              <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" />
              <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" />
            </svg>
          </button>
        </div>
      </section>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={showEditModal}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onSave={handleSaveEdit}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
      />

      {/* Delete Modal */}
      <RemoveUserModal
        isOpen={showDeleteModal}
        count={selectedIndexes.length}
        onConfirm={confirmDeleteUsers}
        onClose={() => setShowDeleteModal(false)}
      />

      {/* EDIT USER STATUS MODAL */}
      <EditUserStatus
        isOpen={editStatusOpen}
        type={editStatusType}
        message={editStatusMessage}
        onClose={() => setEditStatusOpen(false)}
      />

      {/* REMOVE USER STATUS MODAL */}
      <RemoveUserStatus
        isOpen={removeStatusOpen}
        type={removeStatusType}
        message={removeStatusMessage}
        onClose={() => setRemoveStatusOpen(false)}
      />
    </>
  );
}
