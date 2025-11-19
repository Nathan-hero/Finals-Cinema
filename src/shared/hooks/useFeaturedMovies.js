// src/hooks/useFeaturedMovies.js
// Summary of file: This custom hook manages the state and logic for featured movies, including transitions and auto-rotation.
import { useState, useEffect } from "react";

export default function useFeaturedMovies(moviesData) {
  const featuredMovies = moviesData.filter((m) => m.featured);
  const [featured, setFeatured] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set initial featured
  useEffect(() => {
    if (featuredMovies.length > 0) {
      setFeatured(featuredMovies[0]);
      setFeaturedIndex(0);
    }
  }, []);

  // Smooth transition
  const transitionToMovie = (index) => {
    if (index === featuredIndex || isTransitioning) return;
    if (index < 0) {
      index = featuredMovies.length - 1;
    } else if (index >= featuredMovies.length) {
      index = 0;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setFeaturedIndex(index);
      setFeatured(featuredMovies[index]);
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-rotate
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      const next = (featuredIndex + 1) % featuredMovies.length;
      transitionToMovie(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredIndex, featuredMovies.length, isTransitioning]);

  return {
    featuredMovies,
    featured,
    featuredIndex,
    isTransitioning,
    transitionToMovie,
  };
}
