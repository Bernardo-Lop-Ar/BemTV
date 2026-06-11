const API_KEY = "abd0ef28";

const searchInput =
document.getElementById("searchInput");

const moviesContainer =
document.getElementById("moviesContainer");

const favoritesContainer =
document.getElementById("favoritesContainer");

const modal =
document.getElementById("modal");

const closeModal =
document.getElementById("closeModal");

const movieDetails =
document.getElementById("movieDetails");

const banner =
document.getElementById("banner");

const bannerTitle =
document.getElementById("bannerTitle");

const bannerPlot =
document.getElementById("bannerPlot");

let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

loadFavorites();

searchInput.addEventListener("keyup", () => {

    const text = searchInput.value;

    if(text.length > 2){
        searchMovies(text);
    }

});

async function searchMovies(title){

    const response =
    await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`
    );

    const data =
    await response.json();

    moviesContainer.innerHTML = "";

    if(!data.Search) return;

    data.Search.forEach(movie => {

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.Poster}">
            <h3>${movie.Title}</h3>
        `;

        card.addEventListener("click", () => {
            openMovie(movie.imdbID);
        });

        moviesContainer.appendChild(card);

    });

    openMovie(data.Search[0].imdbID, true);

}

async function openMovie(id, bannerMode = false){

    const response =
    await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
    );

    const movie =
    await response.json();

    if(bannerMode){

        banner.style.backgroundImage =
        `
        linear-gradient(
        rgba(0,0,0,.2),
        rgba(0,0,0,.9)
        ),
        url('${movie.Poster}')
        `;

        banner.style.backgroundSize = "cover";
        banner.style.backgroundPosition = "center";

        bannerTitle.textContent =
        movie.Title;

        bannerPlot.textContent =
        movie.Plot;

        return;
    }

    movieDetails.innerHTML = `
        <div class="detail-wrapper">

            <img src="${movie.Poster}">

            <div class="info">

                <h2>${movie.Title}</h2>

                <p>
                    <strong>Ano:</strong>
                    ${movie.Year}
                </p>

                <p>
                    <strong>Gênero:</strong>
                    ${movie.Genre}
                </p>

                <p>
                    <strong>Diretor:</strong>
                    ${movie.Director}
                </p>

                <p>
                    <strong>Elenco:</strong>
                    ${movie.Actors}
                </p>

                <p>
                    <strong>IMDb:</strong>
                    ⭐ ${movie.imdbRating}
                </p>

                <p>${movie.Plot}</p>

                <button
                    class="favorite-btn"
                    onclick="addFavorite('${movie.imdbID}')">

                    Adicionar à Minha Lista

                </button>

                <button
                    class="favorite-btn"
                    onclick="excluirFavorite('${movie.imdbID}')">
                    Remover da Lista
                </button>

            </div>

        </div>
    `;

    modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.onclick = e => {

    if(e.target === modal){
        modal.style.display = "none";
    }

};

async function addFavorite(id){

    if(favorites.includes(id)){
        return;
    }

    favorites.push(id);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();

    modal.style.display = "none";
} 


function excluirFavorite(id){

    favorites = favorites.filter(
        favoriteId => favoriteId !== id
    );

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();

    modal.style.display = "none";
}

async function loadFavorites(){

    favoritesContainer.innerHTML = "";

    for(const id of favorites){

        const response =
        await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
        );

        const movie =
        await response.json();

        const card =
        document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.Poster}">
            <h3>${movie.Title}</h3>
        `;

        card.onclick = () =>
        openMovie(movie.imdbID);

        favoritesContainer.appendChild(card);
    }
}

searchMovies("Spider man");

function login(){

    const user =
    document.getElementById("user").value;

    const password =
    document.getElementById("password").value;

    if(
        user === "admin" &&
        password === "123456"
    ){

        document.getElementById(
            "loginScreen"
        ).style.display = "none";

    }else{

        document.getElementById(
            "loginError"
        ).textContent =
        "Usuário ou senha inválidos";

    }

}