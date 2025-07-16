function initInvoicePage() {
  const invoiceLink = document.getElementById("invoice-management-link");
    if (invoiceLink) {
      invoiceLink.addEventListener("click", renderInvoiceManagementPage());
    }
};
window.initInvoicePage = initInvoicePage;

