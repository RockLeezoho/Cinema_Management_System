function initConcessionPage() {
  const concessionLink = document.getElementById("concession-management-link");
    if (concessionLink) {
      concessionLink.addEventListener("click", renderConcessionManagementPage());
    }
};
window.initConcessionPage = initConcessionPage;

