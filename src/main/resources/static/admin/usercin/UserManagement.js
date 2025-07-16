// Common reusable functions and constants
const BASE_PATH_USERS = "http://localhost:8080/_adminv1-cinpenut/users";
const token = localStorage.getItem("jwtToken");
//const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbIlJPTEVfQURNSU4iXSwic3ViIjoidHJhbiIsImlhdCI6MTc1MDE3MTMzMCwiZXhwIjoxNzUwMjU3NzMwfQ.LzxIef5jOGUqgIYluSv8I14JsFTHwKn7uCdEy6bF7Pc";
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

function createActionButtons(userId, typeUser) {
  return (typeUser === 'employee') ? `
    <button class="btn btn-outline-info btn-sm me-1 btn-edit" data-id="${userId}">
      <i class="bi bi-eye text-primary"></i>
    </button>
    <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${userId}">
      <i class="bi bi-trash"></i>
    </button>
  ` : `
    <button class="btn btn-outline-info btn-sm me-1 btn-edit" data-id="${userId}">
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

async function fetchUsers(page = 0, size = 10, path, userType) {
  try {
    const res = await fetch(`${path}?page=${page}&size=${size}&userType=${userType}`, {
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

// ========================== EMPLOYEE ==========================
async function renderEmployeeManagementPage(event) {
  if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "NHÂN VIÊN";
  document.querySelector("#search-orders").placeholder = "Mã nhân viên";
  renderTableHeader(["Mã nhân viên", "Tên nhân viên", "Email", "SĐT", "Chức vụ"]);

  bindSearchForm(BASE_PATH_USERS, showEmployees, loadEmployeesByPage);
  document.querySelector("#add-items").addEventListener("click", () => openEmployeeForm(null));
  await loadEmployeesByPage(0);
}

function showEmployees(data) {
  const filteredData = data.filter(item =>
    ["admin"].includes(item.role.toLowerCase())
  );
  clearAndRenderTable(filteredData, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.userId}</td>
      <td class="cell">${item.name}</td>
      <td class="cell">${item.email}</td>
      <td class="cell">${item.phone}</td>
      <td class="cell">${item.position}</td>
      <td class="cell">${createActionButtons(item.userId, 'employee')}</td>
    `;
    return row; //phai return mot DOM Node
  });

  // Gắn lại sự kiện sau khi render
  attachEmployeeActionEvents();
}

function attachEmployeeActionEvents() {
  document.querySelectorAll(".btn-edit").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      console.log("Sửa nhân viên ID:", id);
      const employee = await searchUserId(id, BASE_PATH_USERS);
      if (employee) {
        openEmployeeForm(employee); // mở form sửa thông tin nhân viên
      }
    });
  });

  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      console.log("Xóa nhân viên ID:", id);
      if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
        try {
          const res = await fetch(`${BASE_PATH_USERS}/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + token
            }
          });
          if (res.ok) {
            alert("Xóa thành công!");
            await loadEmployeesByPage(0);
          } else {
            alert("Xóa thất bại!");
          }
        } catch (error) {
          console.error("Lỗi xóa nhân viên:", error);
        }
      }
    });
  });
}

async function loadEmployeesByPage(pageNumber) {
  try {
    const pageData = await fetchUsers(pageNumber, 10, BASE_PATH_USERS, 1);

    showEmployees(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadEmployeesByPage);
  } catch (e) {
    console.error("Lỗi tải nhân viên: ", e);
  }
}

// ========================== CUSTOMER ==========================
async function renderCustomerManagementPage(event) {
    if (event) event.preventDefault();
  document.getElementById("page-title").textContent = "KHÁCH HÀNG";
  document.querySelector("#search-orders").placeholder = "Mã khách hàng";
  renderTableHeader(["Mã khách hàng", "Tên đăng nhập", "Email", "SĐT", "Trạng thái"]);

  bindSearchForm(BASE_PATH_USERS, showCustomers, loadCustomersByPage);
  document.querySelector("#add-items").addEventListener("click", () => openCustomerForm(null));
  await loadCustomersByPage(0);
}

function showCustomers(data) {
  const filteredData = data.filter(item =>
    ["guest", "member"].includes(item.role.toLowerCase())
  );
  clearAndRenderTable(filteredData, item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cell">${item.userId}</td>
      <td class="cell">${item.username}</td>
      <td class="cell">${item.email}</td>
      <td class="cell">${item.phone}</td>
      <td class="cell">${item.accountStatus}</td>
      <td class="cell">${createActionButtons(item.userId, 'customer')}</td>
    `;
    return row;
  });

  // Gắn lại sự kiện sau khi render
  attachCustomerActionEvents();
}

function attachCustomerActionEvents() {
  document.querySelectorAll(".btn-edit").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      console.log("Sửa khách hàng ID:", id);
      const customer = await searchUserId(id, BASE_PATH_USERS);
      if (customer) {
        openCustomerForm(customer);
      }
    });
  });

  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      console.log("Xóa khách hàng ID:", id);
      if (confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
        try {
          const res = await fetch(`${BASE_PATH_USERS}/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + token
            }
          });
          if (res.ok) {
            alert("Xóa thành công!");
            await loadCustomersByPage(0);
          } else {
            alert("Xóa thất bại!");
          }
        } catch (error) {
          console.error("Lỗi xóa khách hàng:", error);
        }
      }
    });
  });
}

async function loadCustomersByPage(pageNumber) {
  try {
    const pageData = await fetchUsers(pageNumber, 10, BASE_PATH_USERS, 2);
    showCustomers(pageData?.content || []);
    renderPagination(pageData?.totalPages || 0, pageNumber, loadCustomersByPage);
  } catch (e) {
    console.error("Lỗi tải khách hàng: ", e);
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

