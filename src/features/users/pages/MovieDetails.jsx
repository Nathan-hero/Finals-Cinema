import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { moviesAPI } from "../../../utils/api";
import moviesData from "../../../shared/data/moviesData";
// User access (Admin can see this section as well)
// Summary of file: This component displays detailed information about a specific movie.

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const fallbackMovie = moviesData.find((m) => m.id === id);
      const isLikelyMongoId = /^[0-9a-fA-F]{24}$/.test(id ?? "");

      if (fallbackMovie && !isLikelyMongoId) {
        setMovie(fallbackMovie);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const backendMovie = await moviesAPI.getMovieById(id);
        
        // Map backend fields to frontend format || This might need changing
        const mappedMovie = {
          id: backendMovie._id,
          title: backendMovie.title,
          genre: Array.isArray(backendMovie.genre) ? backendMovie.genre.join(", ") : backendMovie.genre,
          runtime: backendMovie.duration,
          rating: backendMovie.movieRating,
          price: movie.price ?? movie.ticketPrice ?? movie.moviePrice ?? 210, // 3
          featured: backendMovie.featured || false,
          schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"], // Default schedule
          about: backendMovie.description,
          poster: backendMovie.posterURL,
          banner: backendMovie.bannerURL,
        };
        
        setMovie(mappedMovie);
        setError(null);
      } catch (err) {
        console.error("Error fetching movie:", err);
        if (fallbackMovie) {
          setMovie(fallbackMovie);
          setError(null);
        } else {
          setError("Failed to load movie");
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
        <p className="text-gray-400 text-xl">Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
        <h1 className="text-2xl font-bold mb-4">{error || "Movie Not Found"}</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-semibold transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-black relative">
      {/* Small movie boxes */}
      <section
        className="relative h-[100vh] flex items-end justify-start p-10"
        style={{
          
        }}
      >
      </section>
    </div>
  );
}