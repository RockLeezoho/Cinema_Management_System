const BASE_PATH_VOUCHERS = "http://localhost:8080/_adminv1-cinpenut/vouchers";
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

function createActionButtons(voucherId) {
    return `
      <button type="button" class="btn btn-outline-primary btn-sm me-1 btn-edit" data-id="${voucherId}" title="Xem hoặc sửa thông tin khuyến mãi">
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

async function fetchVouchers(page = 0, size = 10, path) {
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

async function searchVoucherId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== VOUCHER ==========================
async function renderVoucherManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "Khuyến Mãi";
  document.querySelector("#search-orders").placeholder = "Mã Khuyến mãi";
  renderTableHeader(["Mã khuyến mãi", "Tiêu đề", "Bắt đầu", "Kết thúc"]);

  bindSearchForm(BASE_PATH_VOUCHERS, showVouchers, loadVouchersByPage);
  document.querySelector("#add-items").addEventListener("click", () => openVoucherForm(null));
  await loadVouchersByPage(0);
}

function convertToSA_CH(timeString) {
  if (!timeString) return "";

  const [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour >= 12 ? "CH" : "SA";
  hour = hour % 12;
  if (hour === 0) hour = 12; // 12 giờ trưa hoặc nửa đêm

  const paddedMinute = minute.toString().padStart(2, '0');

  return `${hour}:${paddedMinute} ${period}`;
}

function showVouchers(data) {
  clearAndRenderTable(data, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.voucherId}</td>
      <td class="cell">${item.title}</td>
      <td class="cell">${convertToSA_CH(item.startTime)}</td>
      <td class="cell">${convertToSA_CH(item.endTime)}</td>
      <td class="cell">${createActionButtons(item.voucherId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachVoucherActionEvents();
}

function attachVoucherActionEvents() {
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          console.log("Sửa khuyến mãi ID:", id);
          const voucher = await searchVoucherId(id, BASE_PATH_VOUCHERS);
          if (voucher) {
            openVoucherForm(voucher);
          }
        });
    });
}

async function loadVouchersByPage(pageNumber) {
  try {
    const pageData = await fetchVouchers(pageNumber, 10, BASE_PATH_VOUCHERS);
    showVouchers(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadVouchersByPage);
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

      searchVoucherId(id, path)
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

