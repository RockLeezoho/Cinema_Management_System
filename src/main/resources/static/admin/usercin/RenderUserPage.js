function initUserPage() {
  const hash = window.location.hash;
  const customerLink = document.getElementById("customer-management-link");
  const employeeLink = document.getElementById("employee-management-link");

  if (customerLink) {
    customerLink.addEventListener("click", renderCustomerManagementPage);
  }
  if (employeeLink) {
    employeeLink.addEventListener("click", renderEmployeeManagementPage);
  }

  if (hash === "#employee-management-link") {
    renderEmployeeManagementPage();
  } else {
    renderCustomerManagementPage();
  }
}
window.initUserPage = initUserPage;

