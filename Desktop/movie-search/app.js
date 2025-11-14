const API_KEY = "YOUR_OMDB_API_KEY";
const BASE_URL = "https://www.omdbapi.com/";

const form = document.getElementById("searchForm");
const queryInput = document.getElementById("query");
const cards = document.getElementById("cards");

// Search form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = queryInput.value.trim();
  if (!query) return;
  await searchMovies(query);
});

// Search movies
async function searchMovies(query) {
  cards.innerHTML = `<li>Searching...</li>`;
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      cards.innerHTML = "";
      data.Search.forEach((movie, index) => {
        const li = document.createElement("li");
        li.className = "cards__item";
        li.innerHTML = `
          <article class="card" data-id="${movie.imdbID}">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/images/placeholder.jpg"}" 
                 alt="${movie.Title} Poster" 
                 class="card__poster" />
            <h3 class="card__title">${movie.Title}</h3>
            <p class="card__meta">${movie.Year}</p>
          </article>
        `;
        li.querySelector(".card").style.animationDelay = `${index * 0.15}s`;
        cards.appendChild(li);
      });
    } else {
      cards.innerHTML = `<li>No results found for "${query}"</li>`;
    }
  } catch (err) {
    console.error(err);
    cards.innerHTML = `<li>Error fetching movies</li>`;
  }
}

