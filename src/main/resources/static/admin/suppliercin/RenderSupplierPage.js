function initSupplierPage() {
  const supplierLink = document.getElementById("supplier-management-link");
    if (supplierLink) {
      supplierLink.addEventListener("click", renderSupplierManagementPage());
    }
};
window.initSupplierPage = initSupplierPage;

