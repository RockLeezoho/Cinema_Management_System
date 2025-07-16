const BASE_PATH_CINEMAS = "http://localhost:8080/_adminv1-cinpenut/cinemas";
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

function createActionButtons(cinemaId) {
    return `
      <button type="button" class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${cinemaId}" title="Xem hoặc sửa thông tin rạp">
        <i class="bi bi-eye text-primary"></i>
      </button>
      <button type="button" class="btn btn-outline-success btn-sm btn-view-rooms" data-id="${cinemaId}" title="Xem danh sách phòng chiếu của rạp">
        <i class="bi bi-building text-info"></i>
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

async function fetchCinemas(page = 0, size = 10, path) {
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

async function searchCinemaId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== CINEMA ==========================
async function renderCinemaManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "Rạp Chiếu";
  document.querySelector("#search-orders").placeholder = "Mã rạp";
  renderTableHeader(["Mã rạp", "Tên rạp", "Địa chỉ", "Hotline"]);

  bindSearchForm(BASE_PATH_CINEMAS, showCinemas, loadCinemasByPage);
  document.querySelector("#add-items").addEventListener("click", () => openCinemaForm(null));
  await loadCinemasByPage(0);
}

function showCinemas(data) {
  clearAndRenderTable(data, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.cinemaId}</td>
      <td class="cell">${item.name}</td>
      <td class="cell">${item.address}</td>
      <td class="cell">${item.hotline}</td>
      <td class="cell">${createActionButtons(item.cinemaId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachCinemaActionEvents();
}

function attachCinemaActionEvents() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          console.log("Sửa rạp ID:", id);
          const cinema = await searchCinemaId(id, BASE_PATH_CINEMAS);
          if (cinema) {
            openCinemaForm(cinema);
          }
        });
    });

    document.querySelectorAll(".btn-view-rooms").forEach(button => {
      button.addEventListener("click", () => {
        const cinemaId = button.getAttribute("data-id");
        // Chuyển trang và truyền cinemaId qua URL
        window.location.href = `room.html?cinemaId=${cinemaId}`;
      });
    });
}

async function loadCinemasByPage(pageNumber) {
  try {
    const pageData = await fetchCinemas(pageNumber, 10, BASE_PATH_CINEMAS);
    showCinemas(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadCinemasByPage);
  } catch (e) {
    console.error("Lỗi tải rạp chiếu: ", e);
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

      searchCinemaId(id, path)
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

