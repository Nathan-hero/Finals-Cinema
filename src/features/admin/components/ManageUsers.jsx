import React, { useState } from "react";

export default function ManageUsers() {
  // Track selected checkboxes
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  function handleSelect(index) {
    // Toggle selection
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
      return;
    }

    // Allow multi-select (for Remove User)
    setSelectedIndexes([...selectedIndexes, index]);
  }

  // Validation rules
  const isEditEnabled = selectedIndexes.length === 1;     // only 1 allowed
  const isRemoveEnabled = selectedIndexes.length >= 1;    // 1 or more allowed

  return (
    <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-3xl px-4">Manage Users</h2>

      <div className="flex flex-wrap items-center justify-between px-4">
        <div className="flex space-x-8">

          {/* EDIT USER BUTTON */}
          <button
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
              <th className="py-4">User</th>
              <th className="py-4">Date Joined</th>
              <th className="py-4"></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr 
                key={i}
                className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
              >
                <td className="py-4 text-white">{i + 1}</td>
                <td className="py-4 text-white">—</td>
                <td className="py-4 text-white">—</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
