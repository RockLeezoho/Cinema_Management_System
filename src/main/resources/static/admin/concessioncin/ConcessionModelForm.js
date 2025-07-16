const token = localStorage.getItem("jwtToken");
async function openConcessionForm(concession = null) {
  try {
    const data = await fetchCinemas(0, 100, '/_adminv1-cinpenut/cinemas');
    const cinemas = data?.content || [];
    const isEdit = concession !== null;
    renderConcessionForm(concession, cinemas, isEdit);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp:", error);
    alert("Không thể tải danh sách rạp.");
  }
}

async function fetchCinemas(page = 0, size = 10, path) {
  try {
    const res = await fetch(`${path}?page=${page}&size=${size}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    return res.ok ? await res.json() : null;
  } catch (e) {
    console.error("Lỗi trang: ", e);
    return null;
  }
}

function renderConcessionForm(concession, cinemas, isEdit) {
    const image = `
    <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
        <img id="concessionPosterPreview" src="${isEdit ? concession.image : ''}"
                             style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
    </div>
    <button id="concessionUploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
    <input type="file" id="concessionPhotoInput" class="form-control d-none" accept=".png, .jpg, .jpeg">
    <div class="mt-2 text-muted" style="font-size: 12px;">
        <i class="mb-1">Dung lượng tối đa: 5MB</i><br>
        <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
    </div>
    `;

    const cinemaCheckboxes = cinemas.map(c => `
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="checkbox"
        name="cinemaIds[]"
        id="cinema-${c.cinemaId}"
        value="${c.cinemaId}"
        ${isEdit && concession?.cinemaIds?.includes(c.cinemaId) ? 'checked' : ''}>
      <label class="form-check-label" for="cinema-${c.cinemaId}">
        ${c.name}
      </label>
    </div>
    `).join('');

    const contentBody = `
    <form id="addConcessionNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên sản phẩm</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="concessionName" value="${isEdit ? concession.name: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giá nhập</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <div class="input-group">
            <input type="number" class="form-control" id="concessionImportPrice" value="${isEdit ? concession.importPrice : ''}" step="1" min="0" required>
            <span class="input-group-text">VND</span>
          </div>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Loại sản phẩm</label>
          <select class="form-select" id="concessionType" required>
              <option value="FOOD" ${isEdit && concession.type === 'FOOD' ? 'selected' : ''}>Đồ ăn</option>
              <option value="DRINK" ${isEdit && concession.type === 'DRINK' ? 'selected' : ''}>Đồ uống</option>
              <option value="SOUVENIR" ${isEdit && concession.type === 'SOUVENIR' ? 'selected' : ''}>Đồ lưu niệm</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giá bán</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <div class="input-group">
            <input type="number" class="form-control" id="concessionSellingPrice" value="${isEdit ? concession.sellingPrice : ''}" step="1" min="0" required>
            <span class="input-group-text">VND</span>
          </div>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số lượng</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="number" class="form-control" id="concessionQuantity" value="${isEdit ? concession.quantity : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã nhà cung cấp</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="concessionSupplierId" value="${isEdit ? concession.supplierId : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã khuyến mại</label>
          <input type="text" class="form-control" id="concessionVoucherId" value="${isEdit ? concession.voucherId : ''}">
          <div class="invalid-feedback"></div>
        </div>
         <div class="col-md-12 mb-3">
            <label class="form-label">Chọn rạp phân phối</label>
            <div id="concessionCinemaIds">
            ${cinemaCheckboxes}
            </div>
            <div class="invalid-feedback d-block"></div>
         </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm';

    showSharedModal(title, contentBody, image);
    addPhoto('concessionUploadBtn', 'concessionPhotoInput', 'concessionPosterPreview');

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        const clonedSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);
        clonedSaveBtn.addEventListener('click', () => {
          saveConcession(concession);
        });
    }
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

const concessionFields = [
    { id: "concessionName", message: "Vui lòng nhập thông tin" },
    { id: "concessionImportPrice", message: "Vui lòng nhập thông tin" },
    { id: "concessionSellingPrice", message: "Vui lòng nhập thông tin" },
    { id: "concessionQuantity", message: "Vui lòng nhập thông tin" },
    { id: "concessionSupplierId", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(concessionFields);

async function saveConcession(concession) {
    if (!validateForm(concessionFields)) {
        return;
    }

    const fileInput = document.getElementById("concessionPhotoInput");
    const imageFileName = fileInput?.files[0] || null;
    const selectedCinemaIds = Array.from(document.querySelectorAll('input[name="cinemaIds[]"]:checked'))
                                .map(cb => Number(cb.value));
    if (selectedCinemaIds.length === 0) {
        alert("Vui lòng chọn ít nhất một rạp phân phối.");
        return;
    }

    const concessionData = {
        name: document.getElementById("concessionName").value.trim(),
        type: document.getElementById("concessionType").value.trim(),
        importPrice: Number(document.getElementById("concessionImportPrice").value),
        sellingPrice: Number(document.getElementById("concessionSellingPrice").value),
        quantity: Number(document.getElementById("concessionQuantity").value),
        supplierId: Number(document.getElementById("concessionSupplierId").value) || null,
        voucherId: Number(document.getElementById("concessionVoucherId").value) || null,
        cinemaIds: selectedCinemaIds.map(id => Number(id))
    };

    try {
        const url = concession ? `${BASE_PATH_CONCESSIONS}/${concession.concessionId}` : BASE_PATH_CONCESSIONS;
        const method = concession ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("concession", JSON.stringify(concessionData));
        if (imageFileName) {
            formData.append("image", imageFileName);
        }

        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (res.ok) {
            const result = await res.json();

            alert(concession ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadConcessionsByPage(0);

        } else {
            const errorText = await res.text();
            alert((concession ? "Cập nhật" : "Thêm") + " sản phẩm thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





