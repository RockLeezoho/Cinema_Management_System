function openEmployeeForm(employee) {
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
        </div>
        <button id="uploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="itemPhoto" class="form-control d-none" accept=".png, .jpg, .jpeg">
        <div class="mt-2 text-muted" style="font-size: 12px;">
            <i class="mb-1">Dung lượng tối đa: 5MB</i><br>
            <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
        </div>
    `;

    const isEdit = employee !== null;

    const contentBody = `
    <form id="addEmployeeNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Họ và tên</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeeFullName" value="${isEdit ? employee.name : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên đăng nhập</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeeUsername" value="${isEdit ? employee.username : ''}" ${isEdit ? 'readonly' : ''} required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày sinh</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="date" class="form-control" style="color: #5A5A63" id="employeeDateOfBirth" value="${isEdit ? employee.dateOfBirth : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mật khẩu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="password" class="form-control" id="employeeReg-password" ${isEdit ? '' : 'required'}>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số điện thoại</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeePhoneNumber" value="${isEdit ? employee.phone : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Xác nhận mật khẩu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="password" class="form-control" id="employeeConfirm-password" ${isEdit ? '' : 'required'}>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Email</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeeEmail" value="${isEdit ? employee.email : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Chức vụ</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeePosition" value="${isEdit ? employee.position : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">CCCD/CMND</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeePersonalId" value="${isEdit ? employee.personalId : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Vai trò</label>
          <select class="form-select" id="employeeRole" required>
            <option ${isEdit && employee.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
            <option ${isEdit && employee.role === 'MANAGER' ? 'selected' : ''}>MANAGER</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã rạp chiếu phim</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="employeeCinemaId" value="${isEdit ? employee.cinemaId : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Trạng thái tài khoản</label>
          <select class="form-select" id="employeeAccountStatus" required>
            <option ${isEdit && employee.status === 'Mới' ? 'selected' : ''}>Mới</option>
            <option ${isEdit && employee.status === 'Đang hoạt động' ? 'selected' : ''}>Đang hoạt động</option>
            <option ${isEdit && employee.status === 'Không hoạt động' ? 'selected' : ''}>Không hoạt động</option>
            <option ${isEdit && employee.status === 'Cấm hoạt động' ? 'selected' : ''}>Cấm hoạt động</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập nhật thông tin nhân viên' : 'Thêm Nhân Viên';

    showSharedModal(title, contentBody, image);
    addPhoto();

    document.getElementById('save-btn').addEventListener('click', () => {
        saveEmployee(employee);
    });
}


function openCustomerForm() {
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
          <img id="posterPreview" src="https://via.placeholder.com/150x200?text=Ảnh"
               style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
        </div>
        <button id="uploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="employeePhoto" class="form-control d-none" accept=".png, .jpg, .jpeg">
        <div class="mt-2 text-muted" style="font-size: 12px;">
          <i class="mb-1">Dung lượng tối đa: 5MB</i><br>
          <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
        </div>
    `;

    const contentBody = `
        <form id="addCustomerNewForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Họ và tên</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="fullName" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tên đăng nhập</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="username" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Ngày sinh</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="date" class="form-control" style="color: #5A5A63" id="dateOfBirth" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Mật khẩu</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="password" class="form-control" id="reg-password" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Số điện thoại</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="phoneNumber" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Xác nhận mật khẩu</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="password" class="form-control" id="confirm-password" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Email</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="email" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Vai trò</label>
              <select class="form-select" id="role" required>
                <option>Thành viên</option>
                <option>Khách mua</option>
              </select>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">CCCD/CMND</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="personalId" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Trạng thái tài khoản</label>
              <select class="form-select" id="accountStatus" required>
                <option>Mới</option>
                <option>Đang hoạt động</option>
                <option>Không hoạt động</option>
                <option>Cấm hoạt động</option>
              </select>
              <div class="invalid-feedback"></div>
            </div>
          </div>
        </form>
    `;

    showSharedModal("Thêm Khách Hàng", contentBody, image);
    addPhoto();
}

//function addPhoto() {
//    // Cap nhat anh xem truoc va kiem tra file tai len
//    const uploadBtn = document.getElementById("uploadBtn");
//    const fileInput = document.getElementById("itemPhoto");
//    const posterPreview = document.getElementById("posterPreview");
//
//    uploadBtn.onclick = function () {
//        fileInput.value = ""; // Đảm bảo onchange luôn kích hoạt
//        fileInput.click();
//    };
//
//    fileInput.onchange = function (event) {
//        const file = event.target.files[0];
//
//        if (file) {
//            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
//            if (!allowedTypes.includes(file.type)) {
//                alert("Định dạng file không hợp lệ! Chỉ chấp nhận PNG, JPG, JPEG.");
//                fileInput.value = "";
//                return;
//            }
//
//            if (file.size > 5 * 1024 * 1024) {
//                alert("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.");
//                fileInput.value = "";
//                return;
//            }
//
//            const reader = new FileReader();
//            reader.onload = function(e) {
//                posterPreview.src = e.target.result;
//                console.log("Ảnh xem trước đã cập nhật.");
//            };
//            reader.readAsDataURL(file);
//        }
//    };
//
//    document.getElementById("uploadBtn").addEventListener("hidden.bs.modal", function () {
//        document.getElementById("posterPreview").src = "https://via.placeholder.com/200x300?text=No+Image"; // default image
//        document.getElementById("itemPhoto").value = ""; // Reset file input
//    });
//}

function addPhoto() {
  // Tìm nút upload và input file hiện có trong modal hiện tại (modal đang mở)
  const uploadBtn = document.querySelector(".modal.show #uploadBtn");
  const fileInput = document.querySelector(".modal.show input[type=file]");
  const posterPreview = document.querySelector(".modal.show #posterPreview");

  if (!uploadBtn || !fileInput || !posterPreview) return; // Nếu không tìm thấy thì dừng

  uploadBtn.onclick = function () {
    fileInput.value = ""; // Reset để onchange luôn chạy
    fileInput.click();
  };

  fileInput.onchange = function () {
    const file = this.files[0];
    if (!file) return;

    // Kiểm tra định dạng
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Vui lòng chọn file ảnh định dạng PNG, JPG hoặc JPEG.");
      this.value = "";
      return;
    }

    // Kiểm tra dung lượng < 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File ảnh không được lớn hơn 5MB.");
      this.value = "";
      return;
    }

    // Hiển thị ảnh preview
    const reader = new FileReader();
    reader.onload = function (e) {
      posterPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
}


function validateForm(fields) {
    let hasError = false;
    let firstInvalid = null;

    fields.forEach(({ id, message }) => {
        const input = document.getElementById(id);
        if (!input) return;

        const feedback = input.nextElementSibling;

        if (!input.value.trim()) {
            input.classList.add("is-invalid");
            if (feedback) feedback.textContent = message;
            if (!firstInvalid) firstInvalid = input;
            hasError = true;
        } else {
            input.classList.remove("is-invalid");
            if (feedback) feedback.textContent = "";
        }
    });

    if (firstInvalid) firstInvalid.focus();
    return !hasError;
}

function attachRealtimeValidation(fields) {
    fields.forEach(({ id }) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener("input", () => {
            if (input.value.trim()) {
                input.classList.remove("is-invalid");
                const feedback = input.nextElementSibling;
                if (feedback) feedback.textContent = "";
            }
        });
    });
}


const employeeFields = [
    { id: "employeeFullName", message: "Vui lòng nhập thông tin" },
    { id: "employeeDateOfBirth", message: "Vui lòng điền ngày sinh" },
    { id: "employeePhoneNumber", message: "Vui lòng nhập thông tin" },
    { id: "employeeEmail", message: "Vui lòng nhập thông tin" },
    { id: "employeePersonalId", message: "Vui lòng nhập thông tin" },
    { id: "employeeCinemaId", message: "Vui lòng nhập thông tin" },
    { id: "employeeUsername", message: "Vui lòng nhập thông tin" },
    { id: "employeeReg-password", message: "Vui lòng nhập thông tin" },
    { id: "employeeConfirm-password", message: "Vui lòng nhập thông tin" },
    { id: "employeePosition", message: "Vui lòng nhập thông tin" },
    { id: "employeeRole", message: "Vui lòng nhập thông tin" },
    { id: "employeeAccountStatus", message: "Vui lòng nhập thông tin" }
];

const customerFields = [
   { id: "fullName", message: "Vui lòng nhập thông tin" },
   { id: "username", message: "Vui lòng nhập thông tin" },
   { id: "dateOfBirth", message: "Vui lòng điền ngày sinh" },
   { id: "reg-password", message: "Vui lòng nhập thông tin" },
   { id: "phoneNumber", message: "Vui lòng nhập thông tin" },
   { id: "confirm-password", message: "Vui lòng nhập thông tin" },
   { id: "personalId", message: "Vui lòng nhập thông tin" },
   { id: "email", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(employeeFields);
attachRealtimeValidation(customerFields);

async function saveEmployee(employee) {

    // Validate form, giả sử bạn có validateForm đã định nghĩa
    if (!validateForm(employeeFields)) {
        return;
    }

    const confirmPassword = document.getElementById("employeeConfirm-password").value;

    // Lấy file ảnh (file input id = itemPhoto)
    const fileInput = document.getElementById("itemPhoto");
    let imageFileName = null;
    if (fileInput.files.length > 0) {
        imageFileName = fileInput.files[0].name;
        // Nếu bạn cần upload ảnh thì xử lý upload file ở đây hoặc sau
    } else if (employee && employee.image) {
        // Khi cập nhật, nếu không đổi ảnh thì giữ ảnh cũ
        imageFileName = employee.image;
    }

    const userData = {
        name: document.getElementById("employeeFullName").value.trim(),
        image: imageFileName,
        dateOfBirth: document.getElementById("employeeDateOfBirth").value,
        phone: document.getElementById("employeePhoneNumber").value.trim(),
        email: document.getElementById("employeeEmail").value.trim(),
        personalId: document.getElementById("employeePersonalId").value.trim(),
        cinemaId: document.getElementById("employeeCinemaId").value.trim(),
        username: document.getElementById("employeeUsername").value.trim(),
        password: document.getElementById("employeeReg-password").value,
        position: document.getElementById("employeePosition").value.trim(),
        role: document.getElementById("employeeRole").value,
        status: document.getElementById("employeeAccountStatus").value
    };

    if (!employee) {
        // Thêm mới thì mật khẩu phải điền và xác nhận phải khớp
        if (!userData.password) {
            alert("Mật khẩu không được để trống!");
            return;
        }
        if (userData.password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
    } else {
        // Cập nhật
        // Nếu người dùng nhập mật khẩu mới thì xác nhận khớp, nếu không thì bỏ qua
        if (userData.password) {
            if (userData.password !== confirmPassword) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }
        } else {
            // Nếu không nhập mật khẩu mới, không gửi password để giữ nguyên mật khẩu cũ
            delete userData.password;
        }
    }

    try {
        const url = employee ? `${BASE_PATH_USERS}/${employee.userId}` : BASE_PATH_USERS;
        const method = employee ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(userData)
        });

        if (res.ok) {
            const result = await res.json();
            alert(employee ? "Cập nhật người dùng thành công!" : "Thêm người dùng thành công!");
            console.log("Kết quả:", result);

            // Tai lai trang hoặc gọi hàm tải lại dữ liệu
            window.location.reload();
        } else {
            const errorText = await res.text();
            alert((employee ? "Cập nhật" : "Thêm") + " người dùng thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}


function saveCustomer() {
    if (validateForm(customerFields)) {
        alert("Đã nhập đầy đủ!");
        // Gửi dữ liệu tại đây (nếu cần)
    }
}




