import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../utils/adminAPI";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from MongoDB
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Error loading users: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(index) {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
      return;
    }
    setSelectedIndexes([...selectedIndexes, index]);
  }

  // Open Edit Modal
  function handleEditUser() {
    if (selectedIndexes.length !== 1) return;
    const user = filteredUsers[selectedIndexes[0]];
    setEditingUser({ ...user });
    setShowEditModal(true);
  }

  // Save Edited User
  async function handleSaveEdit() {
    if (!editingUser) return;

    try {
      await adminAPI.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
      });
      alert("User updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
      setSelectedIndexes([]);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  }

  // Handle Remove Users
  async function handleRemoveUsers() {
    if (selectedIndexes.length === 0) return;

    const selectedUserIds = selectedIndexes.map(index => filteredUsers[index]._id);

    if (!window.confirm(`Delete ${selectedIndexes.length} user(s)? This will also delete their reservations.`)) return;

    try {
      await Promise.all(selectedUserIds.map(id => adminAPI.deleteUser(id)));
      alert("Users deleted successfully!");
      setSelectedIndexes([]);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Error deleting users: " + err.message);
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validation rules
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

            {/* EDIT USER BUTTON */}
            <button
              onClick={handleEditUser}
              disabled={!isEditEnabled}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 
                ${isEditEnabled
                  ? "bg-white text-black hover:bg-gray-200 cursor-pointer"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
              Edit User
            </button>

            {/* REMOVE USER BUTTON */}
            <button
              onClick={handleRemoveUsers}
              disabled={!isRemoveEnabled}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full w-44 
                ${isRemoveEnabled
                  ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-black text-sm rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
              <svg width="18" height="18" fill="none">
                <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2"/>
                <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Users Table */}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    {searchQuery ? "No users found" : "No users available"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <tr 
                    key={user._id || i}
                    className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                  >
                    <td className="py-4 text-white">{i + 1}</td>
                    <td className="py-4 text-white text-left">{user.name}</td>
                    <td className="py-4 text-gray-300 text-left">{user.email}</td>
                    <td className="py-4 text-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-xl p-6 w-96 space-y-4">
            <h3 className="text-2xl font-semibold text-white">Edit User</h3>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full bg-neutral-800 text-white rounded px-3 py-2 border border-neutral-700 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full bg-neutral-800 text-white rounded px-3 py-2 border border-neutral-700 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 bg-neutral-700 text-white py-2 rounded-lg hover:bg-neutral-600 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}