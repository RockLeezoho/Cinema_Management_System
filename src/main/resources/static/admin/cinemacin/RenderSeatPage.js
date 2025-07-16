function initSeatPage() {
  const seatLink = document.getElementById("seat-management-link");
    if (seatLink) {
      seatLink.addEventListener("click", renderSeatManagementPage());
    }
};
window.initSeatPage = initSeatPage;

