// Common reusable functions and constants
const BASE_PATH_USERS = "http://localhost:8080/_adminv1-cinpenut/movies";
//const token = localStorage.getItem("token");
const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbIlJPTEVfQURNSU4iXSwic3ViIjoibGV2byIsImlhdCI6MTc0NzYxNDgyOCwiZXhwIjoxNzQ3NjI1NjI4fQ.xKfOHP9AmG_kDZepUzxjL3JMK3F-IfWFeYT3eMFvaZE";

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

function createActionButtons(movieId) {
  return `
    <button class="btn btn-outline-info btn-sm me-1 btn-edit" data-id="${movieId}">
      <i class="bi bi-eye"></i>
    </button>
    <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${movieId}">
      <i class="bi bi-trash"></i>
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

async function fetchMovies(page = 0, size = 10, path) {
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

async function searchUserId(id, path) {
  const res = await fetch(`${path}/${id}`, {
  headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer " + token
  } });
  return res.ok ? res.json() : null;
}

// ========================== MOVIE ==========================
async function renderMovieManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "PHIM";
  document.querySelector("#search-orders").placeholder = "Mã phim";
  renderTableHeader(["Mã phim", "Tên phim", "Loại phim", "Độ tuổi", "Thời lượng"]);

  bindSearchForm(BASE_PATH_USERS, showMovies, loadMoviesByPage);
  document.querySelector("#add-items").addEventListener("click", () => openMovieForm(null));
  await loadMoviesByPage(0);
}

function showMovies(data) {
  const filteredData = data.filter(item =>
    ["admin", "manager"].includes(item.role.toLowerCase())
  );
  clearAndRenderTable(filteredData, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.movieId}</td>
      <td class="cell">${item.title}</td>
      <td class="cell">${item.type}</td>
      <td class="cell">${item.agerating}</td>
      <td class="cell">${item.duration}</td>
      <td class="cell">${createActionButtons(item.movieId)}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachMovieActionEvents();
}

function attachMovieActionEvents() {
  document.querySelectorAll(".btn-edit").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      console.log("Sửa phim ID:", id);
      const movie = await searchUserId(id, BASE_PATH_USERS);
      if (movie) {
        openMovieForm(movie); // mở form sửa thông tin phim
      }
    });
  });

  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      console.log("Xóa phim ID:", id);
      if (confirm("Bạn có chắc chắn muốn xóa phim này không?")) {
        try {
          const res = await fetch(`${BASE_PATH_USERS}/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + token
            }
          });
          if (res.ok) {
            alert("Xóa thành công!");
            await loadMoviesByPage(0);
          } else {
            alert("Xóa thất bại!");
          }
        } catch (error) {
          console.error("Lỗi xóa phim:", error);
        }
      }
    });
  });
}

async function loadMoviesByPage(pageNumber) {
  try {
    const pageData = await fetchUsers(pageNumber, 10, BASE_PATH_USERS, 1);
    showMovies(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadMoviesByPage);
  } catch (e) {
    console.error("Lỗi tải phim: ", e);
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

      searchUserId(id, path)
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

