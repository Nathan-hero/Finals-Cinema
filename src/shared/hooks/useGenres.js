// src/hooks/useGenres.js
// Summary of file: This custom hook extracts and returns a list of unique genres from the provided movies data.
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
