function initTicketTypePage() {
  const ticketTypeLink = document.getElementById("ticketType-management-link");
    if (ticketTypeLink) {
      ticketTypeLink.addEventListener("click", renderTicketTypeManagementPage());
    }
};
window.initTicketTypePage = initTicketTypePage;

