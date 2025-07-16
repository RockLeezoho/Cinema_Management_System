function initVoucherPage() {
  const voucherLink = document.getElementById("voucher-management-link");
    if (voucherLink) {
      voucherLink.addEventListener("click", renderVoucherManagementPage());
    }
};
window.initVoucherPage = initVoucherPage;

