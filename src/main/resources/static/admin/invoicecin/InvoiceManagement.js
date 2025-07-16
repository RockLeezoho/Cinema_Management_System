const BASE_PATH_INVOICES = "http://localhost:8080/_adminv1-cinpenut/invoices";
const token = localStorage.getItem("jwtToken");

// ========================== COMMON ==========================
function renderTableHeader(columns) {
  const headRow = columns.map(col => `<th class="cell">${col}</th>`).join("");
  document.querySelector("#contentEachPage thead tr").innerHTML = headRow;
}

function clearAndRenderTable(data, renderRowFn) {
  const tbody = document.querySelector("#contentEachPage tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Không có dữ liệu</td></tr>`;
    return;
  }
  data.forEach(item => tbody.appendChild(renderRowFn(item)));
}

function createActionButtons(invoiceId) {
    return `
      <button type="button" class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${invoiceId}" title="Xem hoặc sửa thông tin loại vé">
        <i class="bi bi-eye text-primary"></i>
      </button>
    `;
}

function renderPagination(totalPages, currentPage, loadFn) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  if (totalPages === 0) return;

  pagination.innerHTML += `
    <li class="page-item ${currentPage === 0 ? "disabled" : ""}">
      <button class="page-link" onclick="${loadFn.name}(${currentPage - 1})">Previous</button>
    </li>
  `;

  for (let i = 0; i < totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link" onclick="${loadFn.name}(${i})">${i + 1}</button>
      </li>
    `;
  }

  pagination.innerHTML += `
    <li class="page-item ${currentPage === totalPages - 1 ? "disabled" : ""}">
      <button class="page-link" onclick="${loadFn.name}(${currentPage + 1})">Next</button>
    </li>
  `;
}

async function fetchInvoices(page = 0, size = 10, path) {
  try {
    const res = await fetch(`${path}?page=${page}&size=${size}`, {
    headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
    } });
    return res.ok ? res.json() : null;
  } catch (e) {
    console.error("Lỗi trang: ", e);
    return null;
  }
}

async function searchInvoiceId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== INVOICE ==========================
async function renderInvoiceManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "Hóa đơn";
  document.querySelector("#search-orders").placeholder = "Mã hóa đơn";
  renderTableHeader(["Mã hóa đơn", "Ngày thanh toán", "Phương thức thanh toán", "Tổng tiền (VND)"]);

  bindSearchForm(BASE_PATH_INVOICES, showInvoices, loadInvoicesByPage);
//  document.querySelector("#add-items").addEventListener("click", () => openInvoiceForm(null));
  await loadInvoicesByPage(0);
}

function showInvoices(data) {
  clearAndRenderTable(data, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.invoiceId}</td>
      <td class="cell">${item.paymentDate}</td>
      <td class="cell">${item.paymentMethod}</td>
      <td class="cell">${item.totalAmount}</td>
      <td class="cell">${createActionButtons(item.invoiceId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachInvoiceActionEvents();
}

function attachInvoiceActionEvents() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          console.log("Xem thông tin hóa đơn ID:", id);
          const invoice = await searchInvoiceId(id, BASE_PATH_INVOICES);
          if (invoice) {
            openInvoiceForm(invoice);
          }
        });
    });
}

async function loadInvoicesByPage(pageNumber) {
  try {
    const pageData = await fetchInvoices(pageNumber, 10, BASE_PATH_INVOICES);
    showInvoices(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadInvoicesByPage);
  } catch (e) {
    console.error("Lỗi tải hóa đơn: ", e);
  }
}

// ========================== SEARCH FORM ==========================
function bindSearchForm(path, showFn, loadFn) {
  const searchForm = document.querySelector(".table-search-form");
  const searchInput = document.querySelector("#search-orders");
  const tbody = document.querySelector("#contentEachPage tbody");

  if (!searchForm.hasAttribute("data-search-bound")) {
    searchForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const id = searchInput.value.trim();

      if (!id) {
        await loadFn(0);
        return;
      }

      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-info">Đang tìm kiếm...</td></tr>`;
      }

      searchInvoiceId(id, path)
        .then(result => {
          if (result) {
            showFn([result]);
          } else {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-warning">Không tìm thấy kết quả phù hợp.</td></tr>`;
          }
        })
        .catch(error => {
          console.error("Lỗi tìm kiếm: ", error);
          tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Đã xảy ra lỗi khi tìm kiếm.</td></tr>`;
        })
        .finally(() => {
          renderPagination(0, 0, loadFn);
        });
    });

    searchForm.setAttribute("data-search-bound", "true");
  }
}

