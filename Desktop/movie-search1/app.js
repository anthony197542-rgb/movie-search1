// === Modal Elements ===
const searchInput = document.getElementById("searchBar");
const movieGrid = document.getElementById("cards");
const modal = document.getElementById('trailerModal');
const frame = document.getElementById('trailerFrame');
const closeBtn = document.getElementById('trailerClose');

// === Open Trailer ===
function openTrailer({ title, youtubeId }) {
  document.getElementById('trailerTitle').textContent = `${title} — Trailer`;
  frame.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

// === Close Trailer ===
function closeTrailer() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  frame.src = ''; // stop playback
}

// === Event Listeners ===
closeBtn.addEventListener('click', closeTrailer);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeTrailer(); // click outside closes modal
});

// Listen for trailer button clicks
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-trailer');
  if (!btn) return;
  const youtubeId = btn.getAttribute('data-trailer-id');
  const title = btn.getAttribute('data-title') || 'Trailer';
  openTrailer({ title, youtubeId });
});

// === Example: Default Search (optional) ===
// If you want to preload some movies via OMDb or TMDb, you can add logic here.
// For now, this file just handles trailer modal behavior.
