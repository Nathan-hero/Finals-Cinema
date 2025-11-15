import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminNavigation() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/movies", label: "Movies", icon: "🎬" },
  ];

  return (
    <div className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
                  border-b-2 
                  ${
                    isActive
                      ? "border-red-600 text-white bg-zinc-800"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-zinc-800/50"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}