import React from "react";

export default function StatCard({ type, count, label }) {
  const icons = {
    movies: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="8" y="28" width="44" height="24" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
        <path d="M10 28 L50 20 L50 12 L10 20 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2"/>
        <rect x="10" y="12" width="9" height="8" fill="#DC2626" transform="rotate(-8 10 20)"/>
        <rect x="21" y="14" width="9" height="8" fill="#991B1B" transform="rotate(-8 21 22)"/>
        <rect x="32" y="16" width="9" height="8" fill="#DC2626" transform="rotate(-8 32 24)"/>
        <rect x="43" y="18" width="7" height="8" fill="#991B1B" transform="rotate(-8 43 26)"/>
      </svg>
    ),
    users: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="18" r="9" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
        <path d="M12 48C12 36 18 30 30 30C42 30 48 36 48 48" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
        <circle cx="30" cy="18" r="4.5" fill="#EF4444"/>
      </svg>
    ),
    reservations: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="9" y="12" width="42" height="39" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
        <rect x="9" y="12" width="42" height="9" fill="#991B1B"/>
      </svg>
    ),
  };

  return (
    <div className="flex items-center justify-between bg-neutral-900 rounded-xl p-6 shadow">
      <div className="flex items-center space-x-3">
        <div className="text-4xl">{icons[type]}</div>
        <div>
          <h2 className="text-2xl font-bold">{count}</h2>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}
