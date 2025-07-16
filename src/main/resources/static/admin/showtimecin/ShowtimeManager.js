const BASE_PATH_SHOWTIMES = "http://localhost:8080/_adminv1-cinpenut/showtimes";
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

function createActionButtons(showtimeId) {
    return `
      <button type="button" class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${showtimeId}" title="Xem hoặc sửa thông tin lịch chiếu">
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

async function fetchShowtimes(page = 0, size = 10, path) {
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

async function searchShowtimeId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== SHOWTIME ==========================
async function renderShowtimeManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "Lịch Chiếu";
  document.querySelector("#search-orders").placeholder = "Mã lịch chiếu";
  renderTableHeader(["Mã lịch chiếu", "Giờ bắt đầu", "Giờ kết thúc", "Ngày chiếu"]);

  bindSearchForm(BASE_PATH_SHOWTIMES, showShowtimes, loadShowtimesByPage);
  document.querySelector("#add-items").addEventListener("click", () => openShowtimeForm(null));
  await loadShowtimesByPage(0);
}

function convertToSA_CH(timeStr) {
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr);
  const suffix = hour < 12 ? "SA" : "CH";

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  return `${hour}:${minute} ${suffix}`;
}

function showShowtimes(data) {
  clearAndRenderTable(data, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.showtimeId}</td>
      <td class="cell">${convertToSA_CH(item.startTime)}</td>
      <td class="cell">${convertToSA_CH(item.endTime)}</td>
      <td class="cell">${item.showDate}</td>
      <td class="cell">${createActionButtons(item.showtimeId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachShowtimeActionEvents();
}

function attachShowtimeActionEvents() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          console.log("Sửa lịch chiếu ID:", id);
          const showtime = await searchShowtimeId(id, BASE_PATH_SHOWTIMES);
          if (showtime) {
            openShowtimeForm(showtime);
          }
        });
    });
}

async function loadShowtimesByPage(pageNumber) {
  try {
    const pageData = await fetchShowtimes(pageNumber, 10, BASE_PATH_SHOWTIMES);
    showShowtimes(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadShowtimesByPage);
  } catch (e) {
    console.error("Lỗi tải lịch chiếu: ", e);
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

      searchShowtimeId(id, path)
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

