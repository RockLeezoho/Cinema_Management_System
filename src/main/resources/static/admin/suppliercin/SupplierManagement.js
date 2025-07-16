const BASE_PATH_SUPPLIERS = "http://localhost:8080/_adminv1-cinpenut/suppliers";
const token = localStorage.getItem("jwtToken");
//const token = "eyJhbGciOUIUZI1NiJ9.eyJyb2xlljpbIPTEVFQURNSU4iXSwic3Viljoid2VzY2xvdW5kliwiaWFOljoxNZUwNDEwNj|3LCJIeHAIOjE3NTAOOTcwMjd9.BbOYVNOQTcCMJNHLrn_nBAPmecliOt!1UviGZJW7FIA";

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

function createActionButtons(supplierId) {
    return `
      <button type="button" class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${supplierId}" title="Xem hoặc sửa thông tin rạp">
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

async function fetchSuppliers(page = 0, size = 10, path) {
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

async function searchSupplierId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== SUPPLIER ==========================
async function renderSupplierManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "Nhà Cung Cấp";
  document.querySelector("#search-orders").placeholder = "Mã nhà cung cấp";
  renderTableHeader(["Mã nhà cung cấp", "Tên nhà cung cấp", "Địa chỉ", "Số điện thoại"]);

  bindSearchForm(BASE_PATH_SUPPLIERS, showSuppliers, loadSuppliersByPage);
  document.querySelector("#add-items").addEventListener("click", () => openSupplierForm(null));
  await loadSuppliersByPage(0);
}

function showSuppliers(data) {
  clearAndRenderTable(data, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.supplierId}</td>
      <td class="cell">${item.name}</td>
      <td class="cell">${item.address}</td>
      <td class="cell">${item.phone}</td>
      <td class="cell">${createActionButtons(item.supplierId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachSupplierActionEvents();
}

function attachSupplierActionEvents() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          console.log("Sửa nhà cung cấp ID:", id);
          const supplier = await searchSupplierId(id, BASE_PATH_SUPPLIERS);
          if (supplier) {
            openSupplierForm(supplier);
          }
        });
    });
}

async function loadSuppliersByPage(pageNumber) {
  try {
    const pageData = await fetchSuppliers(pageNumber, 10, BASE_PATH_SUPPLIERS);
    showSuppliers(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadSuppliersByPage);
  } catch (e) {
    console.error("Lỗi tải nhà cung cấp: ", e);
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

      searchSupplierId(id, path)
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

