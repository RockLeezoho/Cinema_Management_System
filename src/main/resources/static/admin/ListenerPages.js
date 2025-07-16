document.addEventListener("DOMContentLoaded", function () {
  const page = new URLSearchParams(window.location.search).get("page");

  switch (page) {
    case "quan-ly-nguoi-dung/khach-hang":
      renderCustomerManagementPage();
      break;
    case "quan-ly-nguoi-dung/nhan-vien":
      renderEmployeeManagementPage();
      break;
    case "quan-ly-phim":
        renderMovieManagementPage();
        break;
    case "quan-ly-rap":
        renderCinemaManagementPage();
        break;
    case "quan-ly-lich-chieu":
        renderShowtimesManagementPage();
        break;
    case "quan-ly-ve/da-ban":
        renderSoldTicketManagementPage();
        break;
    case "quan-ly-ve/loai-ve":
        renderTicketTypeManagementPage();
        break;
    case "quan-hoa-don":
        renderInvoiceManagementPage();
        break;
    case "quan-khuyen-mai":
        renderVoucherManagementPage();
        break;
    case "quan-ly-an-uong-luu-niem":
        renderConcessionManagementPage();
        break;
    default:
         if (!window.location.pathname.endsWith("manager.html")) {
                window.location.href = "manager.html";
              }
              break;
  }
});
