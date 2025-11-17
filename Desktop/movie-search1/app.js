// movieGallery.js

const API_KEY = " c9f7240a"; // Replace with your OMDb/TMDb key
const searchInput = document.getElementById("searchInput");
const gallery = document.getElementById("gallery");

// Fetch movies from OMDb based on query
async function searchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=aspx?VERIFYKEY=69049292-f4df-4f20-9c02-dce257e19ade
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      renderGallery(data.Search);
    } else {
      gallery.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    gallery.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}

// Render movie cards into the gallery
function renderGallery(movies) {
  gallery.innerHTML = ""; // Clear previous results

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="trailer-btn" data-title="${movie.Title}">Watch Trailer</button>
    `;

    gallery.appendChild(card);
  });

  // Attach trailer modal logic
  attachTrailerEvents();
}

// Example trailer modal logic (stubbed for now)
function attachTrailerEvents() {
  const buttons = document.querySelectorAll(".trailer-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title");
      alert(`Trailer modal would open for: ${title}`);
      // Later: integrate YouTube/TMDb trailer fetch here
    });
  });
}

// Event listener for search bar
searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      searchMovies(query);
    }
  }
});
