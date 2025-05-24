document.addEventListener("DOMContentLoaded", () => {

  const customerLink = document.getElementById("customer-management-link");
  const employeeLink = document.getElementById("employee-management-link");

  if (customerLink) {
    customerLink.addEventListener("click", renderCustomerManagementPage);
  }

  if (employeeLink) {
    employeeLink.addEventListener("click", renderEmployeeManagementPage);
  }

  renderEmployeeManagementPage();
});
