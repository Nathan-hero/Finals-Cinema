// src/hooks/useGenres.js
export default function useGenres(moviesData) {
  const genres = [
    "All",
    ...new Set(
      moviesData.flatMap((m) =>
        Array.isArray(m.genre)
          ? m.genre
          : (m.genre || "").split(",").map((g) => g.trim())
      )
    ).values(),
  ];
  return genres;
}
