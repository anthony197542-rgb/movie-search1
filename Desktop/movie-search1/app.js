// Futuristic Movie DB — Full JS Logic
// Author: Anthony

// Replace with your own OMDb API key (get one at http://www.omdbapi.com/apikey.aspx)
const API_KEY = "c9f7240a";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button"); // optional if you add a button in HTML
  const cardsContainer = document.getElementById("cards");
  const chips = document.querySelectorAll("#genreChips .chip");
  const sortSelect = document.getElementById("sortSelect");
  const modal = document.querySelector(".modal");
  const modalClose = document.querySelector(".modal-close");
  const trailerWrap = document.querySelector(".trailer-wrap");

  // ==========================
  // SEARCH MOVIES (OMDb API)
  // ==========================
  async function searchMovies(query) {
    const url = `https://www.omdbapi.com/?apikey=${c9f7240a}&s=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        // Render search results
        renderGallery(data.Search);
      } else {
        cardsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      cardsContainer.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
  }

  // ==========================
  // RENDER MOVIE CARDS
  // ==========================
  function renderGallery(movies) {
    cardsContainer.innerHTML = ""; // clear old results

    movies.forEach(movie => {
      const card = document.createElement("article");
      card.classList.add("card");
      card.dataset.genre = "Unknown"; // OMDb Search doesn’t include genre
      card.dataset.year = movie.Year;
      card.dataset.rating = 0; // OMDb Search doesn’t include rating

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

    attachTrailerEvents();
  }

  // ==========================
  // TRAILER MODAL LOGIC
  // ==========================
  function attachTrailerEvents() {
    const buttons = document.querySelectorAll(".btn-trailer");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        // Embed a YouTube search iframe for the trailer
        trailerWrap.innerHTML = `
          <iframe width="560" height="315"
            src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + " trailer")}"
            frameborder="0" allowfullscreen>
          </iframe>
        `;
        modal.style.display = "block";
      });
    });
  }

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
    trailerWrap.innerHTML = "";
  });

 // ==========================
// FILTER BY GENRE
// ==========================
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    // update active chip styling
    chips.forEach(c => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");

    const selectedGenre = (chip.dataset.genre || "").toLowerCase();
    const cards = cardsContainer.querySelectorAll(".card");

    cards.forEach(card => {
      const cardGenre = (card.dataset.genre || "").toLowerCase();
      const show = selectedGenre === "all" || cardGenre === selectedGenre;
      card.style.display = show ? "" : "none"; // "" preserves CSS layout
    });
  });
});

  // ==========================
  // SORTING
  // ==========================
  sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;
    const cards = Array.from(cardsContainer.querySelectorAll(".card"));

    cards.sort((a, b) => {
      if (sortBy === "rating") {
        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      }
      if (sortBy === "year") {
        return parseInt(b.dataset.year) - parseInt(a.dataset.year);
      }
      if (sortBy === "title") {
        return a.querySelector(".card__title").textContent
          .localeCompare(b.querySelector(".card__title").textContent);
      }
      // Popularity: leave as-is for now
      return 0;
    });

    cardsContainer.innerHTML = "";
    cards.forEach(card => cardsContainer.appendChild(card));
  });

  // ==========================
  // SEARCH BAR EVENTS
  // ==========================
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) searchMovies(query);
    }
  });

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) searchMovies(query);
    });
  }
});

