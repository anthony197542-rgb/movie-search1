const searchInput = document.getElementById("searchBar");
const movieGrid = document.getElementById('movieGrid');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

// ✅ Your OMDb API key
const API_KEY = "c9f7240a";

async function fetchMovies(query) {
  if (!query) {
    movieGrid.innerHTML = "<p style='text-align:center;color:#ccc;'>Type a movie name above...</p>";
    return;
  }

  const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
  const data = await response.json();

  if (data.Response === "True") {
    movieGrid.innerHTML = data.Search.map((movie, index) => `
      <div class="movie-card" style="animation-delay:${index * 0.1}s" onclick="fetchMovieDetails('${movie.imdbID}')">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/220x320?text=No+Poster'}" alt="${movie.Title}">
        <p class="movie-title">${movie.Title}</p>
        <p class="movie-year">${movie.Year}</p>
      </div>
    `).join('');
  } else {
    movieGrid.innerHTML = "<p style='text-align:center;color:#f55;'>No movies found.</p>";
  }
}

// Fetch full movie details
async function fetchMovieDetails(id) {
  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
  const movie = await response.json();

  modalBody.innerHTML = `
    <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}" alt="${movie.Title}">
    <h2 style="color:#00ffff;">${movie.Title} (${movie.Year})</h2>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Rating:</strong> ${movie.imdbRating}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
  `;
  modal.style.display = "block";
}

// Close modal

window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

// Listen for typing in search bar
searchInput.addEventListener('keyup', () => {
  const query = searchInput.value.trim();
  fetchMovies(query);
});

// Load some default movies on page load
fetchMovies("Matrix");
