// src/data/moviesData.js
// Temporary static movie data for fallback and testing purposes
const moviesData = [
  {
    id: "m1",
    title: "Inception",
    genre: "Action, Sci-Fi, Thriller",
    runtime: 148,
    rating: "PG-13",
    price: 210,
    featured: true,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "A skilled thief is offered a chance to have his past crimes forgiven if he can implant another person's idea into a target's subconscious. A thrilling journey through dreamscapes and mind-bending heists.",
    poster: "/posters/poster1.jpg",
    banner: "/banners/banner1.jpg",
  },
  {
    id: "m2",
    title: "Frozen",
    genre: "Animation, Fantasy, Musical, Family",
    runtime: 102, // actual runtime of Frozen
    rating: "PG",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "When their kingdom is trapped in eternal winter, fearless Anna teams up with Kristoff, Olaf, and Sven to find her sister Elsa and restore summer. A magical journey filled with adventure, music, and self-discovery.",
    poster: "/posters/poster2.jpg",
    banner: "/banners/banner2.jpg",
  },
  {
    id: "m3",
    title: "The Dark Knight",
    genre: "Action, Crime, Drama",
    runtime: 152, // actual runtime of The Dark Knight
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on Gotham. Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "/posters/poster3.jpg",
    banner: "/banners/banner3.jpg",
  },
  {
    id: "m5",
    title: "Interstellar",
    genre: "Sci-Fi, Drama, Adventure",
    runtime: 169, // actual runtime of Interstellar
    rating: "PG-13",
    price: 210,
    featured: true,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival, facing time dilation, unknown planets, and the limits of love and human ingenuity.",
    poster: "/posters/poster4.jpg",
    banner: "/banners/banner4.jpg",
  },
  {
    id: "m6",
    title: "Parasite",
    genre: "Thriller, Drama, Mystery",
    runtime: 132, // actual runtime of Parasite
    rating: "R",
    price: 210,
    featured: true,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "The poor Kim family schemes to become employed by the wealthy Park family and infiltrate their household, leading to an unexpected and darkly humorous series of events that explore class conflict and human greed.",
    poster: "/posters/poster5.jpg",
    banner: "/banners/banner5.jpg",
  },
  {
    id: "m7",
    title: "The Greatest Showman",
    genre: "Musical, Drama, Biography",
    runtime: 132, // actual runtime of Parasite
    rating: "R",
    price: 210,
    featured: true,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "The poor Kim family schemes to become employed by the wealthy Park family and infiltrate their household, leading to an unexpected and darkly humorous series of events that explore class conflict and human greed.",
    poster: "/posters/poster6.jpg",
    banner: "/banners/banner6.jpg",
  },
  {
    id: "m8",
    title: "Coco",
    genre: "Animation, Fantasy, Musical, Family",
    runtime: 105, // actual runtime of Coco
    rating: "PG",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Aspiring musician Miguel enters the Land of the Dead to uncover his family's history and pursue his dream of becoming a musician. A heartwarming story about family, memory, and following your passion.",
    poster: "/posters/poster7.jpg",
    banner: "/banners/banner7.jpg",
  },
  {
    id: "m9",
    title: "A Quiet Place",
    genre: "Horror, Thriller, Sci-Fi",
    runtime: 90, // actual runtime of A Quiet Place
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "In a post-apocalyptic world, a family must live in silence while hiding from creatures that hunt by sound. A tense and emotional thriller about survival and family bonds.",
    poster: "/posters/poster8.jpg",
    banner: "/banners/banner8.jpg",
  },
  {
    id: "m11",
    title: "Avatar",
    genre: "Sci-Fi, Adventure, Action",
    runtime: 114, // actual runtime of Barbie
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Barbie embarks on an exciting journey of self-discovery and adventure in a vibrant, fantastical world full of humor, friendship, and life lessons.",
    poster: "/posters/poster10.webp",
    banner: "/banners/banner10.webp",
  },
  {
    id: "m12",
    title: "Titanic",
    genre: "Romance, Drama",
    runtime: 195, // actual runtime of Titanic
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated RMS Titanic. A sweeping tale of romance, tragedy, and class differences.",
    poster: "/posters/poster11.webp",
    banner: "/banners/banner11.webp",
  },
  {
    id: "m13",
    title: "The Lion King",
    genre: "Animation, Adventure, Drama",
    runtime: 88, // actual runtime of The Lion King
    rating: "PG",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Lion prince Simba flees his kingdom after the murder of his father, Mufasa, only to learn the true meaning of responsibility and bravery as he grows up and fights to reclaim his throne.",
    poster: "/posters/poster12.webp",
    banner: "/banners/banner12.webp",
  },
  {
    id: "m14",
    title: "Jurassic Park",
    genre: "Adventure, Sci-Fi, Thriller",
    runtime: 127, // actual runtime of Jurassic Park
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok, putting everyone on the island in grave danger.",
    poster: "/posters/poster13.webp",
    banner: "/banners/banner13.webp",
  },
  {
    id: "m15",
    title: "Iron Man",
    genre: "Action, Sci-Fi, Superhero",
    runtime: 126, // actual runtime of Iron Man
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "After being held captive in an Afghan cave, billionaire engineer Tony Stark builds a high-tech suit of armor to escape and becomes the superhero Iron Man, fighting against evil and injustice.",
    poster: "/posters/poster14.webp",
    banner: "/banners/banner14.webp",
  },
  {
    id: "m16",
    title: "The Incredible Hulk",
    genre: "Action, Sci-Fi, Superhero",
    runtime: 112, // actual runtime of The Incredible Hulk
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Bruce Banner, a scientist on the run from the U.S. government, must find a cure for his gamma radiation-induced condition while being hunted, ultimately transforming into the powerful Hulk when angered.",
    poster: "/posters/poster15.webp",
    banner: "/banners/banner15.webp",
  },
  {
    id: "m17",
    title: "Iron Man 2",
    genre: "Action, Sci-Fi, Superhero",
    runtime: 124, // actual runtime of Iron Man 2
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Tony Stark, now recognized as Iron Man, faces pressure from the government, the press, and the public to share his technology while a vengeful Russian inventor, Ivan Vanko, emerges as a formidable adversary. Stark must confront his legacy and fight to protect the world.",
    poster: "/posters/poster16.webp",
    banner: "/banners/banner16.webp",
  },
  {
    id: "m18",
    title: "Thor",
    genre: "Action, Fantasy, Superhero",
    runtime: 115, // actual runtime of Thor (2011)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Thor, the powerful but arrogant god of thunder, is cast out of Asgard to live among humans on Earth. Stripped of his powers, he must prove himself worthy to reclaim his hammer and save his realm from destruction.",
    poster: "/posters/poster17.webp",
    banner: "/banners/banner17.webp",
  },
  {
    id: "m19",
    title: "Captain America: The First Avenger",
    genre: "Action, Adventure, War, Superhero",
    runtime: 124, // actual runtime of Captain America: The First Avenger (2011)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "During World War II, frail Steve Rogers is transformed into the super-soldier Captain America. He must stop the Red Skull and his organization Hydra from unleashing a dangerous weapon while becoming a symbol of hope for the Allies.",
    poster: "/posters/poster18.webp",
    banner: "/banners/banner18.webp",
  },
  {
    id: "m20",
    title: "The Avengers",
    genre: "Action, Sci-Fi, Superhero",
    runtime: 143, // actual runtime of The Avengers (2012)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Earth's mightiest heroes — Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye — must unite to stop Loki and his alien army from enslaving humanity. A thrilling team-up of iconic superheroes in an epic battle to save the planet.",
    poster: "/posters/poster19.webp",
    banner: "/banners/banner19.webp",
  },
  {
    id: "m21",
    title: "Iron Man 3",
    genre: "Action, Sci-Fi, Superhero",
    runtime: 130, // actual runtime of Iron Man 3 (2013)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "After the events of The Avengers, Tony Stark faces a formidable terrorist known as the Mandarin. Struggling with PTSD and his personal demons, Stark must protect those he loves while confronting a powerful enemy threatening global security.",
    poster: "/posters/poster20.webp",
    banner: "/banners/banner20.webp",
  },
  {
    id: "m22",
    title: "Thor: The Dark World",
    genre: "Action, Fantasy, Superhero",
    runtime: 112, // actual runtime of Thor: The Dark World (2013)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Thor must team up with his treacherous brother Loki to save the Nine Realms from the dark elf Malekith, who seeks to plunge the universe into darkness using a powerful ancient weapon.",
    poster: "/posters/poster21.webp",
    banner: "/banners/banner21.webp",
  },
  {
    id: "m23",
    title: "Captain America: The Winter Soldier",
    genre: "Action, Thriller, Superhero",
    runtime: 136, // actual runtime of Captain America: The Winter Soldier (2014)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "Captain America teams up with Black Widow and Falcon to uncover a conspiracy within S.H.I.E.L.D. and confront a mysterious assassin known as the Winter Soldier, testing his loyalty and strength.",
    poster: "/posters/poster22.webp",
    banner: "/banners/banner22.webp",
  },
  {
    id: "m24",
    title: "Guardians of the Galaxy",
    genre: "Action, Sci-Fi, Comedy, Superhero",
    runtime: 121, // actual runtime of Guardians of the Galaxy (2014)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe. A hilarious and action-packed space adventure with an unforgettable soundtrack.",
    poster: "/posters/poster23.webp",
    banner: "/banners/banner23.webp",
  },
  {
    id: "m25",
    title: "Avengers: Age of Ultron",
    genre: "Action, Sci-Fi, Superhero",
    runtime: 141, // actual runtime of Avengers: Age of Ultron (2015)
    rating: "PG-13",
    price: 210,
    schedule: ["2025-10-10T15:00", "2025-10-10T19:00", "2025-10-11T13:30"],
    about:
      "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program, things go awry and Earth's mightiest heroes—Iron Man, Thor, Hulk, and the rest—must stop the villainous Ultron from enacting his terrible plan.",
    poster: "/posters/poster24.webp",
    banner: "/banners/banner24.webp",
  }

];

export default moviesData;
