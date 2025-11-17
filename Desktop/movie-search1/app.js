// === API Key (OMDb) ===
const API_KEY = "69049292-f4df-4f20-9c02-dce257e19ade";

// === DOM Elements ===
const searchInput = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");
const movieGrid = document.getElementById("cards");
const modal = document.getElementById("trailerModal");
const frame = document.getElementById("trailerFrame");
const closeBtn = document.getElementById("trailerClose");

// === Static Trailer Map (YouTube IDs) ===
// Add more titles + IDs as needed
const TRAILER_MAP = {
  "Neon Drift": "dQw4w9WgXcQ",
  "Fast and Furious": "2TAOizOnNPo",
  "Inception": "YoHD9XEInc0",
  "Tron": "L9szn1QQfas",
  "Blade Trilogy": "N0pJYTwZ1-U",
  "Warrior": "I3YjF2fZkU4",
  "The Veil": "abcd1234",
  "Matrix": "m8e-FF8MsqU"
};

// === Open Trailer ===
function openTrailer({ title, youtubeId }) {
  document.getElementById("trailerTitle").textContent = `${title} — Trailer`;
  frame.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // lock scroll
}

// === Close Trailer ===
function closeTrailer() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  frame.src = ""; // stop playback
  document.body.style.overflow = ""; // restore scroll
}

// === Event Listeners ===
closeBtn.addEventListener("click", closeTrailer);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeTrailer(); // click outside closes modal
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeTrailer(); // Esc key closes modal
});

// Listen for trailer button clicks
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-trailer");
  if (!btn) return;
  const title = btn.getAttribute("data-title") || "Trailer";
  const youtubeId = TRAILER_MAP[title] || "dQw4w9WgXcQ"; // fallback
  openTrailer({ title, youtubeId });
});

// === Fetch Movies from OMDb ===
async function searchMovies(query) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data.Response === "True") {
      renderMovies(data.Search);
    } else {
      movieGrid.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (err) {
    console.error("Error fetching movies:", err);
    movieGrid.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}

// === Render Movies into Cards ===
function renderMovies(movies) {
  movieGrid.innerHTML = movies
    .map(
      (movie) => `
      <article class="card">
        <div class="card__poster">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "./placeholder.jpg"}" alt="${movie.Title} Poster">
        </div>
        <div class="card__body">
          <div class="card__title">${movie.Title}</div>
          <div class="card__meta">${movie.Year} • ${movie.Type}</div>
          <button class="btn-trailer" 
                  data-title="${movie.Title}">
            Watch Trailer
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

// === Search Button Click ===
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

// === Optional: Trigger search on Enter key ===
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchMovies(searchInput.value.trim());
  }
});
