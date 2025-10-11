import { useParams, useNavigate } from "react-router-dom";
import movies from "../data/moviesData";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-3">Movie not found</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
      <p className="text-slate-600 mb-2">Rating: {movie.rating}</p>
      <p className="text-slate-700 mb-4">
        Price: <span className="font-semibold">₱{movie.price}</span>
      </p>
      <button
        onClick={() => alert(`Booked ticket for ${movie.title}!`)}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Book Ticket
      </button>
    </div>
  );
}
