function convertSA_CHTo24h(timeStr) {
  const [time, suffix] = timeStr.trim().toUpperCase().split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (suffix === "SA") {
    if (hour === 12) hour = 0; // 12 SA = 00:00
  } else if (suffix === "CH") {
    if (hour !== 12) hour += 12;
  }

  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function openVoucherForm(voucher) {
    const isEdit = voucher !== null;
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
            <img id="voucherPosterPreview" src="${isEdit ? voucher.image : ''}"
                                   style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
        </div>
        <button id="voucherUploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="voucherPhotoInput" class="form-control d-none" accept=".png, .jpg, .jpeg">
        <div class="mt-2 text-muted" style="font-size: 12px;">
            <i class="mb-1">Dung lượng tuối đa: 5MB</i><br>
            <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
        </div>
    `;

    const contentBody = `
    <form id="addVoucherNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tiêu đề</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="voucherTitle" value="${isEdit ? voucher.title: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Điều kiện</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="voucherCondition" value="${isEdit ? voucher.condition : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giờ bắt đầu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input
            type="time"
            class="form-control"
            id="voucherStartTime"
            name="voucherStartTime"
            value="${isEdit ? voucher.startTime : ''}"
            required
            step="60"
          >
          <div class="invalid-feedback"></div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label">Giờ kết thúc</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input
            type="time"
            class="form-control"
            id="voucherEndTime"
            name="voucherEndTime"
            value="${isEdit ? voucher.endTime : ''}"
            required
            step="60"
          >
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Khuyến Mãi' : 'Thêm Khuyến Mãi';

    showSharedModal(title, contentBody, image);
    addPhoto('voucherUploadBtn', 'voucherPhotoInput', 'voucherPosterPreview');

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveVoucher(voucher);
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

const voucherFields = [
    { id: "voucherTitle", message: "Vui lòng nhập thông tin" },
    { id: "voucherCondition", message: "Vui lòng nhập thông tin" },
    { id: "voucherStartTime", message: "Vui lòng nhập thông tin" },
    { id: "voucherEndTime", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(voucherFields);

async function saveVoucher(voucher) {
    if (!validateForm(voucherFields)) {
        return;
    }

    const fileInput = document.getElementById("voucherPhotoInput");
    const imageFileName = fileInput?.files[0] || null;

    const voucherData = {
        title: document.getElementById("voucherTitle").value.trim(),
        condition: document.getElementById("voucherCondition").value.trim(),
        startTime: document.getElementById("voucherStartTime").value,
        endTime: document.getElementById("voucherEndTime").value
    };

    try {
        const url = voucher ? `${BASE_PATH_VOUCHERS}/${voucher.voucherId}` : BASE_PATH_VOUCHERS;
        const method = voucher ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("voucher", JSON.stringify(voucherData));
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

            alert(voucher ? "Cập nhật khuyễn mãi thành công!" : "Thêm khuyến mãi thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadVouchersByPage(0);

        } else {
            const errorText = await res.text();
            alert((voucher ? "Cập nhật" : "Thêm") + " khuyến mãi thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





