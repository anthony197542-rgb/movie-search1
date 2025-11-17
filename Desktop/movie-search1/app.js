/* ==========================================================================
   Futuristic Movie DB — Interactivity
   Author: Anthony
   Notes:
   - Handles trailer modal
   - Search, filter, and sort functionality
   - Fetches movie data from OMDb API using API key
   ========================================================================== */

// ------------------------------
// API Key (replace with your own)
// ------------------------------
const API_KEY = "c9f7240a"; // <-- put your OMDb key here
const API_URL = "https://www.omdbapi.com/";

// ------------------------------
// Trailer Modal
// ------------------------------
const trailerButtons = document.querySelectorAll('.btn-trailer');
const trailerModal = document.getElementById('trailerModal');
const trailerFrame = document.getElementById('trailerFrame');
const trailerTitle = document.getElementById('trailerTitle');
const trailerClose = document.getElementById('trailerClose');

trailerButtons.forEach(button => {
  button.addEventListener('click', () => {
    const trailerId = button.dataset.trailerId;
    const title = button.dataset.title;

    trailerTitle.textContent = title;
    trailerFrame.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;

    trailerModal.style.display = 'block';
  });
});

trailerClose.addEventListener('click', () => {
  trailerModal.style.display = 'none';
  trailerFrame.src = ''; // stop video
});

window.addEventListener('click', e => {
  if (e.target === trailerModal) {
    trailerModal.style.display = 'none';
    trailerFrame.src = '';
  }
});

// ------------------------------
// Search Functionality
// ------------------------------
const searchInput = document.getElementById('search-input');
const cards = document.querySelectorAll('.card');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector('.card__title').textContent.toLowerCase();
    const genre = card.dataset.genre.toLowerCase();
    const year = card.dataset.year;

    if (
      title.includes(query) ||
      genre.includes(query) ||
      year.includes(query)
    ) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  // Example: fetch from OMDb when searching
  if (query.length > 2) {
    fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.Search) {
          console.log("API results:", data.Search);
          // You could dynamically add cards here based on API results
        }
      })
      .catch(err => console.error("API error:", err));
  }
});

// ------------------------------
// Genre Filter Chips
// ------------------------------
const genreChips = document.querySelectorAll('#genreChips .chip');

genreChips.forEach(chip => {
  chip.addEventListener('click', () => {
    genreChips.forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');

    const genre = chip.dataset.genre;
    cards.forEach(card => {
      card.style.display =
        genre === 'All' || card.dataset.genre === genre ? '' : 'none';
    });
  });
});

// ------------------------------
// Sorting
// ------------------------------
const sortSelect = document.getElementById('sortSelect');
const cardsContainer = document.getElementById('cards');

sortSelect.addEventListener('change', e => {
  const sortBy = e.target.value;
  const sortedCards = Array.from(cards).sort((a, b) => {
    if (sortBy === 'year') {
      return b.dataset.year - a.dataset.year;
    }
    if (sortBy === 'rating') {
      return b.dataset.rating - a.dataset.rating;
    }
    if (sortBy === 'title') {
      return a.querySelector('.card__title').textContent.localeCompare(
        b.querySelector('.card__title').textContent
      );
    }
    // Popularity fallback (keep original order)
    return 0;
  });

  cardsContainer.innerHTML = '';
  sortedCards.forEach(card => cardsContainer.appendChild(card));
});
