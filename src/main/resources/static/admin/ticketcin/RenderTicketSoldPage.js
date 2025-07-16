function initTicketSoldPage() {
  const ticketSoldLink = document.getElementById("ticketSold-management-link");
    if (ticketSoldLink) {
      ticketSoldLink.addEventListener("click", renderTicketSoldManagementPage());
    }
};
window.initTicketSoldPage = initTicketSoldPage;

