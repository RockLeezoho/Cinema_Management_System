const BASE_PATH_CONCESSIONS = "http://localhost:8080/_adminv1-cinpenut/concessions";
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

function createActionButtons(concessionId) {
    return `
      <button type="button" class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${concessionId}" title="Xem hoặc sửa thông tin rạp">
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

async function fetchConcessions(page = 0, size = 10, path) {
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

async function searchConcessionId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== CONCESSION ==========================
async function renderConcessionManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "Sản Phẩm";
  document.querySelector("#search-orders").placeholder = "Mã sản phẩm";
  renderTableHeader(["Mã sản phẩm", "Tên sản phẩm", "Giá nhập", "Giá bán", "Số lượng"]);

  bindSearchForm(BASE_PATH_CONCESSIONS, showConcessions, loadConcessionsByPage);
  document.querySelector("#add-items").addEventListener("click", () => openConcessionForm(null));
  await loadConcessionsByPage(0);
}

function showConcessions(data) {
  clearAndRenderTable(data, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.concessionId}</td>
      <td class="cell">${item.name}</td>
      <td class="cell">${item.importPrice}</td>
      <td class="cell">${item.sellingPrice}</td>
      <td class="cell">${item.quantity}</td>
      <td class="cell">${createActionButtons(item.concessionId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachConcessionActionEvents();
}

function attachConcessionActionEvents() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          console.log("Sửa sản phẩm ID:", id);
          const concession = await searchConcessionId(id, BASE_PATH_CONCESSIONS);
          if (concession) {
            openConcessionForm(concession);
          }
        });
    });

    document.querySelectorAll(".btn-view-rooms").forEach(button => {
      button.addEventListener("click", () => {
        const concessionId = button.getAttribute("data-id");
        // Chuyển trang và truyền concessionId qua URL
        window.location.href = `room.html?concessionId=${concessionId}`;
      });
    });
}

async function loadConcessionsByPage(pageNumber) {
  try {
    const pageData = await fetchConcessions(pageNumber, 10, BASE_PATH_CONCESSIONS);
    showConcessions(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadConcessionsByPage);
  } catch (e) {
    console.error("Lỗi tải sản phẩm: ", e);
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

      searchConcessionId(id, path)
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

