function initMoviePage() {
  const movieLink = document.getElementById("movie-management-link");
    if (movieLink) {
      movieLink.addEventListener("click", renderMovieManagementPage());
    }
};
window.initMoviePage = initMoviePage;

