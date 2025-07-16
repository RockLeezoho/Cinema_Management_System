function openEmployeeForm(employee) {
    const isEdit = employee !== null;
//    console.log(employee.image);
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
        <img id="employeePosterPreview" src="${isEdit ? employee.image : ''}"
                       style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
        </div>
        <button id="employeeUploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="employeePhotoInput" class="form-control d-none" accept=".png, .jpg, .jpeg">
        <div class="mt-2 text-muted" style="font-size: 12px;">
            <i class="mb-1">Dung lượng tối đa: 5MB</i><br>
            <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
        </div>
    `;


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
            <option value="NEW" ${isEdit && employee.accountStatus === 'NEW' ? 'selected' : ''}>Mới</option>
            <option value="ACTIVE" ${isEdit && employee.accountStatus === 'ACTIVE' ? 'selected' : ''}>Đang hoạt động</option>
            <option value="INACTIVE" ${isEdit && employee.accountStatus === 'INACTIVE' ? 'selected' : ''}>Không hoạt động</option>
            <option value="BANNED" ${isEdit && employee.accountStatus === 'BANNED' ? 'selected' : ''}>Cấm hoạt động</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Nhân Viên' : 'Thêm Nhân Viên';

    showSharedModal(title, contentBody, image);
    addPhoto('employeeUploadBtn', 'employeePhotoInput', 'employeePosterPreview');

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveUser(employee, 'employee');
    });
}

function openCustomerForm(customer) {
    const isEdit = customer !== null;
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
          <img id="customerPosterPreview" src="${isEdit ? customer.image : ''}"
               style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
        </div>
        <button id="customerUploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="customerPhotoInput" class="form-control d-none" accept=".png, .jpg, .jpeg">
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
              <input type="text" class="form-control" id="customerFullName" value="${isEdit ? customer.name : ''}" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tên đăng nhập</label>
              <input type="text" class="form-control" id="customerUsername" value="${isEdit ? customer.username : ''}">
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Ngày sinh</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="date" class="form-control" style="color: #5A5A63" id="customerDateOfBirth" value="${isEdit ? customer.dateOfBirth : ''}" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-control" id="customerReg-password">
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Số điện thoại</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="customerPhoneNumber" value="${isEdit ? customer.phone : ''}" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Xác nhận mật khẩu</label>
              <input type="password" class="form-control" id="customerConfirm-password">
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Email</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="customerEmail" value="${isEdit ? customer.email : ''}" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Vai trò</label>
              <select class="form-select" id="customerRole" required>
                <option ${isEdit && customer.role === 'GUEST' ? 'selected' : ''}>GUEST</option>
                <option ${isEdit && customer.role === 'MEMBER' ? 'selected' : ''}>MEMBER</option>
              </select>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">CCCD/CMND</label>
              <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
              <input type="text" class="form-control" id="customerPersonalId" value="${isEdit ? customer.personalId : ''}" required>
              <div class="invalid-feedback"></div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Trạng thái tài khoản</label>
              <select class="form-select" id="customerAccountStatus" required>
                <option value="NONE" ${isEdit && customer.accountStatus === 'NONE' ? 'selected' : ''}>Không có tài khoản</option>
                <option value="NEW" ${isEdit && customer.accountStatus === 'NEW' ? 'selected' : ''}>Mới</option>
                <option value="ACTIVE" ${isEdit && customer.accountStatus === 'ACTIVE' ? 'selected' : ''}>Đang hoạt động</option>
                <option value="INACTIVE" ${isEdit && customer.accountStatus === 'INACTIVE' ? 'selected' : ''}>Không hoạt động</option>
                <option value="BANNED" ${isEdit && customer.accountStatus === 'BANNED' ? 'selected' : ''}>Cấm hoạt động</option>
              </select>
              <div class="invalid-feedback"></div>
            </div>
          </div>
        </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Khách Hàng' : 'Thêm Khách Hàng';
    showSharedModal(title, contentBody, image);
    addPhoto('customerUploadBtn', 'customerPhotoInput', 'customerPosterPreview');

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveUser(customer, 'customer');
    });
}

function addPhoto(uploadBtnId, fileInputId, previewImgId) {
  const uploadBtn = document.getElementById(uploadBtnId);
  const fileInput = document.getElementById(fileInputId);
  const posterPreview = document.getElementById(previewImgId);

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
    { id: "employeeDateOfBirth", message: "Vui lòng nhập thông tin" },
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
   { id: "customerFullName", message: "Vui lòng nhập thông tin" },
   { id: "customerDateOfBirth", message: "Vui lòng điền ngày sinh" },
   { id: "customerPhoneNumber", message: "Vui lòng nhập thông tin" },
   { id: "customerEmail", message: "Vui lòng nhập thông tin" },
   { id: "customerPersonalId", message: "Vui lòng nhập thông tin" },
   { id: "customerRole", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(employeeFields);
attachRealtimeValidation(customerFields);

async function saveUser(user, typeUser) {
    const fields = (typeUser === 'employee') ? employeeFields : customerFields;
    if(!validateForm(fields)) return;


   const id = typeUser === 'employee' ? "employeeConfirm-password" : "customerConfirm-password";
   const input = document.getElementById(id);
   const confirmPassword = input ? input.value : "";


    const fileInput = (typeUser === 'employee') ? document.getElementById("employeePhotoInput") : document.getElementById("customerPhotoInput");
    const imageFileName = fileInput?.files[0] || null;

    const userData = (typeUser === 'employee') ? {
        name: document.getElementById("employeeFullName").value.trim(),
        dateOfBirth: document.getElementById("employeeDateOfBirth").value,
        phone: document.getElementById("employeePhoneNumber").value.trim(),
        email: document.getElementById("employeeEmail").value.trim(),
        personalId: document.getElementById("employeePersonalId").value.trim(),
        cinemaId: document.getElementById("employeeCinemaId").value.trim(),
        username: document.getElementById("employeeUsername").value.trim(),
        password: document.getElementById("employeeReg-password").value,
        position: document.getElementById("employeePosition").value.trim(),
        role: document.getElementById("employeeRole").value,
        accountStatus: document.getElementById("employeeAccountStatus").value
    } :
    {
       name: document.getElementById("customerFullName").value.trim(),
       username: document.getElementById("customerUsername").value.trim(),
       dateOfBirth: document.getElementById("customerDateOfBirth").value,
       password: document.getElementById("customerReg-password").value,
       phone: document.getElementById("customerPhoneNumber").value.trim(),
       email: document.getElementById("customerEmail").value.trim(),
       role: document.getElementById("customerRole").value,
       personalId: document.getElementById("customerPersonalId").value.trim(),
       accountStatus: document.getElementById("customerAccountStatus").value
    };

    if (typeUser === "employee") {
      if (userData.password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }
    } else if (typeUser === "customer") {
      if (userData.password && userData.password.trim() !== "") {
        if (userData.password !== confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }
      } else {
        delete userData.password;
      }
    }


    try {
        const url = user ? `${BASE_PATH_USERS}/${user.userId}` : BASE_PATH_USERS;
        const method = user ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("user", JSON.stringify(userData));
        formData.append("image", imageFileName);

        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (res.ok) {
            const result = await res.json();
            alert(user ? "Cập nhật người dùng thành công!" : "Thêm người dùng thành công!");
            document.querySelector(".btn-close")?.click();
            if (typeUser === 'employee') {
              await loadEmployeesByPage(0);
            } else {
              await loadCustomersByPage(0);
            }

        } else {
            const errorText = await res.text();
            alert((employee ? "Cập nhật" : "Thêm") + " người dùng thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}




