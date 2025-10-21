// src/data/moviesData.js
const moviesData = [
  {
    id: "m1",
    title: "Aurora Nights",
    runtime: 118,
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    poster:
      "https://images.unsplash.com/photo-1517604931442-6fbf3f6a1f8a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "Skyline Heist",
    runtime: 102,
    rating: "R",
    price: 250,
    schedule: ["2025-10-10T16:00", "2025-10-11T20:00"],
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "m3",
    image: "",
    title: "Last Horizon",
    runtime: 130,
    rating: "R",
    price: 200,
    featured: true,
    genre: ["Action", "Sci-fi", "Comedy"],
    schedule: ["2025-10-10T12:30", "2025-10-11T17:00"],
    poster:
      "",
    description: "Determined to save humanity, a rogue astronaut embarks on a perilous mission to the edge of the solar system, confronting cosmic dangers and personal demons along the way."
  },
  {
    id: "m4",
    image: "/backgrounds/Wednesday.png",
    title: "Wednesday",
    runtime: 130,
    rating: "PG",
    price: 180,
    featured: true,
    genre: ["Mystery", "Comedy"],
    schedule: ["2025-10-10T12:30", "2025-10-11T17:00"],
    poster:"/poster/wednesday-poster.jpg",
    description: "Smart, sarcastic, and a little dead inside, Wednesday Addams investigates twisted mysteries while making new friends—and foes—at Nevermore Academy."
  },
];

export default moviesData;
