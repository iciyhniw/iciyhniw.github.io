const apiKey = "984219b4f1f8a4e70470dd5a2d9177d8"; // Ваш API-ключ


// Клік на кнопку пошуку
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) searchMovies(query);
});

// Введення в поле пошуку
document.getElementById("searchInput").addEventListener("input", (event) => {
  const query = event.target.value.trim();
  if (query) {
    getSuggestions(query);
  } else {
    clearSuggestions();
  }
});

// Пошук фільмів
async function searchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=uk`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
    clearSuggestions(); // Очищаємо підказки після пошуку
  } catch (error) {
    console.error("Помилка при отриманні даних:", error);
  }
}

// Отримання підказок
async function getSuggestions(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=uk&page=1&include_adult=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displaySuggestions(data.results);
  } catch (error) {
    console.error("Помилка при отриманні підказок:", error);
  }
}

// Виведення підказок
function displaySuggestions(suggestions) {
  const container = document.getElementById("suggestions");
  container.innerHTML = "";

  if (suggestions.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement("div");
    suggestionElement.classList.add("suggestion");
    suggestionElement.textContent = suggestion.title;

    suggestionElement.addEventListener("click", () => {
      document.getElementById("searchInput").value = suggestion.title;
      searchMovies(suggestion.title);
    });

    container.appendChild(suggestionElement);
  });
}

// Очищення підказок
function clearSuggestions() {
  const container = document.getElementById("suggestions");
  container.innerHTML = "";
  container.style.display = "none";
}

// Виведення результатів пошуку
function displayMovies(movies) {
  const container = document.getElementById("moviesContainer");
  container.innerHTML = "";

  if (movies.length === 0) {
    container.innerHTML = "<p>❌ Нічого не знайдено</p>";
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/200x300?text=No+Image";

    movieElement.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}" class="poster">
            <h3>${movie.title}</h3>
            <p>📅 Дата виходу: ${movie.release_date || "Невідомо"}</p>
            <p>⭐ Рейтинг: ${movie.vote_average}</p>
        `;

    // Додавання кліку для відображення деталей
    movieElement.addEventListener("click", () => showMovieDetails(movie));

    container.appendChild(movieElement);
  });
}

// Показати деталі фільму
function showMovieDetails(movie) {
  alert(`
🎬 Назва: ${movie.title}
📅 Дата виходу: ${movie.release_date || "Невідомо"}
⭐ Рейтинг: ${movie.vote_average}
📖 Опис: ${movie.overview || "Опис відсутній"}
    `);
}
