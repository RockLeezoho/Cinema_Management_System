function initCinemaPage() {
  const cinemaLink = document.getElementById("cinema-management-link");
    if (cinemaLink) {
      cinemaLink.addEventListener("click", renderCinemaManagementPage());
    }
};
window.initCinemaPage = initCinemaPage;

