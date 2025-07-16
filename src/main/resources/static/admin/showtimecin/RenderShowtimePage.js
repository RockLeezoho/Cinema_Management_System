function initShowtimePage() {
  const showtimeLink = document.getElementById("showtime-management-link");
    if (showtimeLink) {
      showtimeLink.addEventListener("click", renderShowtimeManagementPage());
    }
};
window.initShowtimePage = initShowtimePage;

