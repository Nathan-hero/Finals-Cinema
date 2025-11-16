import React from "react";

export default function ManageMovies() {
  return (
    <section className="bg-neutral-900 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-3xl px-4">Manage Movies</h2>

      <div className="flex flex-wrap items-center justify-between px-4">
        <div className="flex flex-wrap space-x-8">
          <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44">Add Movie</button>
          <button className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 w-44">Edit Movie</button>
          <button className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-700 w-44">Remove Movie</button>
        </div>

        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Movies"
            className="w-full bg-white text-black text-sm rounded-full pl-4 pr-9 py-2 border border-gray-300 focus:ring-2 focus:ring-red-600"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2"/>
              <line x1="11" y1="11" x2="16" y2="16" stroke="black" strokeWidth="2"/>
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
              <th className="px-6 py-3">Featured</th>
              <th className="px-6 py-3">Date Added</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-neutral-800 hover:bg-neutral-800 text-center">
                <td className="px-6 py-4">{i + 1}</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4">—</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <input type="checkbox" className="accent-red-500 w-5 h-5" />
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
