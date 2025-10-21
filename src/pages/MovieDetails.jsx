
import { useParams, useNavigate } from "react-router-dom";
import moviesData from "../data/moviesData";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = moviesData.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-black bg-black">
        <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
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