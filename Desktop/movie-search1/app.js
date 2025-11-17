// === OMDb API Setup ===
const apiKey = " c9f7240a"; // Replace with your OMDb key

// === Search Movies (basic info) ===
async function getMoviesFromOMDb(searchTerm) {
  const endpoint = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.Response === "True") {
      console.log("🎬 OMDb Search Results:", data.Search);
      displayMovies(data.Search);
      return data.Search;
    } else {
      console.warn("⚠️ OMDb Error:", data.Error);
      return [];
    }
  } catch (error) {
    console.error("❌ Fetch Failed:", error);
    return [];
  }
}

// === Get Full Movie Details (by IMDb ID) ===
async function getFullMovieDetails(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      console.log("📖 Full Movie Details:", data);
      return data;
    } else {
      console.warn("⚠️ OMDb Error:", data.Error);
      return null;
    }
  } catch (error) {
    console.error("❌ Fetch Failed:", error);
    return null;
  }
}

// === Render Movies into Gallery ===
function displayMovies(movies) {
  const gallery = document.getElementById("movie-gallery");
  gallery.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    // Random tilt for graffiti vibe
    const tilt = Math.floor(Math.random() * 9) - 4;
    card.style.transform = `rotate(${tilt}deg)`;

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="btn-trailer" data-id="${movie.imdbID}">Watch Trailer</button>
    `;

    gallery.appendChild(card);
  });

  // Attach trailer button listeners
  document.querySelectorAll(".btn-trailer").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const imdbID = e.target.getAttribute("data-id");
      const details = await getFullMovieDetails(imdbID);
      if (details) {
        openTrailerModal(details);
      }
    });
  });
}

// === Trailer Modal Logic ===
// === Trailer Modal Logic ===
function openTrailerModal(details) {
  const modal = document.querySelector(".modal");
  const modalContent = modal.querySelector(".trailer-wrap");

  // Embed a YouTube trailer search based on the movie title
  modalContent.innerHTML = `
    <iframe class="trailer-frame"
      src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(details.Title + " trailer")}"
      allowfullscreen>
    </iframe>
    <div style="padding: 1rem; color: #e0f7ff;">
      <h2>${details.Title} (${details.Year})</h2>
      <p><strong>Genre:</strong> ${details.Genre}</p>
      <p><strong>Director:</strong> ${details.Director}</p>
      <p><strong>Plot:</strong> ${details.Plot}</p>
    </div>
  `;

  // Show the modal
  modal.classList.add("open");

  // Close button logic
  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    modalContent.innerHTML = ""; // clear trailer when closing
  });
}
