
// Replace with your own OMDb API key (get one at http://www.omdbapi.com/apikey.aspx)
const API_KEY = "c9f7240a";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button"); // optional if you add a button
const cardsContainer = document.getElementById("cards");

// Fetch movies from OMDb
async function searchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=${c9f7240a}&s=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      renderGallery(data.Search);
    } else {
      cardsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    cardsContainer.innerHTML = `<p>Something went wrong. Please try again.</p>`;
  }
}

// Render movie cards
function renderGallery(movies) {
  cardsContainer.innerHTML = ""; // clear old results

  movies.forEach(movie => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card__poster">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
      </div>
      <div class="card__body">
        <div class="card__title">${movie.Title}</div>
        <div class="card__meta">${movie.Year}</div>
        <button class="btn-trailer" data-title="${movie.Title}">Watch Trailer</button>
      </div>
    `;

    cardsContainer.appendChild(card);
  });
}

// Event listeners
searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) searchMovies(query);
  }
});

// If you add a search button in HTML:
// <button id="search-button">Search</button>
if (searchButton) {
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) searchMovies(query);
  });
}
