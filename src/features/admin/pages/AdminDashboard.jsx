import React from "react";
import StatCard from "../components/StatCard";
import ManageMovies from "../components/ManageMovies";
import ManageUsers from "../components/ManageUsers";
import ManageReservations from "../components/ManageReservations";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard type="movies" count={50} label="Movies" />
        <StatCard type="users" count={5} label="Users" />
        <StatCard type="reservations" count={15} label="Reservations" />
      </div>

      {/* Sections */}
      <ManageMovies />
      <ManageUsers />
      <ManageReservations />
    </div>
  );
}
