import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-6 shadow">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-4xl">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="28" width="44" height="24" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
                  <path d="M10 28 L50 20 L50 12 L10 20 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2"/>
                  <rect x="10" y="12" width="9" height="8" fill="#DC2626" transform="rotate(-8 10 20)"/>
                  <rect x="21" y="14" width="9" height="8" fill="#991B1B" transform="rotate(-8 21 22)"/>
                  <rect x="32" y="16" width="9" height="8" fill="#DC2626" transform="rotate(-8 32 24)"/>
                  <rect x="43" y="18" width="7" height="8" fill="#991B1B" transform="rotate(-8 43 26)"/>
                  <line x1="14" y1="34" x2="46" y2="34" stroke="#991B1B" strokeWidth="1.5"/>
                  <line x1="14" y1="40" x2="46" y2="40" stroke="#991B1B" strokeWidth="1.5"/>
                  <line x1="14" y1="46" x2="46" y2="46" stroke="#991B1B" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">50</h2> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <p className="text-gray-400 text-sm">Movies</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-6 shadow">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-4xl">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="18" r="9" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
                  <path d="M12 48C12 36 18 30 30 30C42 30 48 36 48 48" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
                  <circle cx="30" cy="18" r="4.5" fill="#EF4444"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">5</h2> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <p className="text-gray-400 text-sm">Users</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-6 shadow">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-4xl">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="12" width="42" height="39" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
                  <rect x="9" y="12" width="42" height="9" fill="#991B1B"/>
                  <line x1="18" y1="6" x2="18" y2="15" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="42" y1="6" x2="42" y2="15" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="15" y="27" width="6" height="6" fill="#EF4444"/>
                  <rect x="27" y="27" width="6" height="6" fill="#EF4444"/>
                  <rect x="39" y="27" width="6" height="6" fill="#EF4444"/>
                  <rect x="15" y="39" width="6" height="6" fill="#EF4444"/>
                  <rect x="27" y="39" width="6" height="6" fill="#EF4444"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">15</h2> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <p className="text-gray-400 text-sm">Reservations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------MANAGE MOVIES SECTION-------------------------- */}
      <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-3xl px-4">Manage Movies</h2>
        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex flex-wrap space-x-8">
            <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44">
              Add Movie
            </button>
            <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44">
              Edit Movie
            </button>
            <button className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 w-44">
              Remove Movie
            </button>
          </div>
            <div className="relative w-96">
            <input
                type="text"
                placeholder="Search Movies"
                className="w-full bg-white text-black text-sm placeholder-gray-500 rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" fill="none"/>
                <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </span>
            </div>
        </div>

    <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4 table-fixed">
            <colgroup>
            <col className="w-20" />             {/* # */}
            <col />                               {/* Title (flex) */}
            <col className="w-48" />              {/* Featured */}
            <col className="w-48" />              {/* Date Added */}
            <col className="w-48" />              {/* Last Updated */}
            <col className="w-20" />              {/* Checkbox */}
            </colgroup>

            <thead className="border-b border-neutral-700 text-gray-300">
            <tr className="text-center">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Featured</th>
                <th className="px-6 py-3">Date Added</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3"></th>
            </tr>
            </thead>

            <tbody>
            {Array.from({ length: 3  }).map((_, i) => (
                <tr
                key={i}
                className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                >
                <td className="px-6 py-4 align-middle">{i + 1}</td> 
                <td className="px-6 py-4 align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="px-6 py-4 align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="px-6 py-4 align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="px-6 py-4 align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="px-6 py-4 align-middle">
                    <div className="flex justify-center">
                    <input type="checkbox" className="accent-red-500 w-5 h-5" />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* Pagination centered under the table */}
        <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor"/>
                <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <span className="text-sm">Page 1</span>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor"/>
                <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
        </div>
    </div>
    </section>

      {/* --------------------------MANAGE USERS SECTION-------------------------- */}
      <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-3xl px-4">Manage Users</h2>
        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex flex-wrap space-x-8">
            <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44">
              Edit User
            </button>
            <button className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 w-44">
              Remove User
            </button>
          </div>
            <div className="relative w-96">
            <input
                type="text"
                placeholder="Search Users"
                className="w-full bg-white text-black text-sm placeholder-gray-500 rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" fill="none"/>
                <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </span>
            </div>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4 table-fixed">
            <colgroup>
            <col className="w-20" />      {/* # */}
            <col />                       {/* User */}
            <col className="w-72" />      {/* Date Joined */}
            <col className="w-20" />      {/* Checkbox */}
            </colgroup>

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
                <td className="py-4 align-middle text-white">{i + 1}</td> 
                <td className="py-4 align-middle text-white">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="py-4 align-middle text-white">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="py-4 align-middle">
                    <div className="flex justify-center">
                    <input type="checkbox" className="accent-red-500 w-5 h-5" />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* Pagination centered */}
        <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor"/>
                <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <span className="text-sm">Page 1</span>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor"/>
                <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
        </div>
        </div>
        </section>

      {/* --------------------------MANAGE RESERVATIONS SECTION-------------------------- */}
      <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-3xl px-4">Manage Reservations</h2>
        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex flex-wrap space-x-8">
            <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44">
              Edit Reservation
            </button>
            <button className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 w-44">
              Remove Reservation
            </button>
          </div>
            <div className="relative w-96">
            <input
                type="text"
                placeholder="Search Reservations"
                className="w-full bg-white text-black text-sm placeholder-gray-500 rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" fill="none"/>
                <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </span>
            </div>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4 table-fixed">
            <colgroup>
            <col className="w-20" />      {/* # */}
            <col className="w-72" />      {/* User */}
            <col />                       {/* Movie */}
            <col className="w-48" />      {/* Date Reserved */}
            <col className="w-20" />      {/* Checkbox */}
            </colgroup>

            <thead className="border-b border-neutral-700">
            <tr className="text-center text-white">
                <th className="py-4 font-semibold">#</th>
                <th className="py-4 font-semibold">User</th>
                <th className="py-4 font-semibold">Movie</th>
                <th className="py-4 font-semibold">Date Reserved</th>
                <th className="py-4 font-semibold"></th>
            </tr>
            </thead>

            <tbody>
            {Array.from({ length: 3}).map((_, i) => (
                <tr
                key={i}
                className="border-b border-neutral-800 hover:bg-neutral-800 text-center"
                >
                <td className="py-4 text-white align-middle">{i + 1}</td>
                <td className="py-4 text-white align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="py-4 text-white align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="py-4 text-white align-middle">—</td> {/* MAKE ACTUAL REFERENCE TO DATABASE */}
                <td className="py-4 align-middle">
                    <div className="flex justify-center">
                    <input type="checkbox" className="accent-red-500 w-5 h-5" />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* Pagination centered */}
        <div className="flex justify-center items-center space-x-4 mt-4 text-gray-400">
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor"/>
                <path d="M22.5 6.25L13.75 12.5L22.5 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.25 6.25L7.5 12.5L16.25 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <span className="text-sm">Page 1</span>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-white">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.75 6.25L17.5 12.5L8.75 18.75V6.25Z" fill="currentColor"/>
                <path d="M2.5 6.25L11.25 12.5L2.5 18.75V6.25Z" fill="currentColor"/>
              </svg>
            </button>
        </div>
        </div>
      </section>
    </div>
  );
}
