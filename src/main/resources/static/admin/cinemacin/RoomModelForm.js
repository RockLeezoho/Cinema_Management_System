function openRoomForm(room) {
    const isEdit = room !== null;
    const urlParams = new URLSearchParams(window.location.search);
    const cinemaIdFromURL = urlParams.get("cinemaId");
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
            <img id="roomPosterPreview" src="${isEdit ? room.image : ''}"
                                   style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
        </div>
        <button id="roomUploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="roomPhotoInput" class="form-control d-none" accept=".png, .jpg, .jpeg">
        <div class="mt-2 text-muted" style="font-size: 12px;">
            <i class="mb-1">Dung lượng tuối đa: 5MB</i><br>
            <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
        </div>
    `;

    const contentBody = `
    <form id="addRoomNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên phòng</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="roomFullName" value="${isEdit ? room.name: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số lượng chỗ ngồi</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="number" class="form-control" id="roomNumberOfSeats" value="${isEdit ? room.numberOfSeats : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã rạp chiếu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="number" class="form-control" id="roomOfCinema" value="${isEdit ? room.cinemaId : cinemaIdFromURL}" readonly required>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Phòng Chiếu' : 'Thêm Phòng Chiếu';

    showSharedModal(title, contentBody, image);
    addPhoto('roomUploadBtn', 'roomPhotoInput', 'roomPosterPreview');

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveRoom(room);
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

const roomFields = [
    { id: "roomFullName", message: "Vui lòng nhập thông tin" },
    { id: "roomNumberOfSeats", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(roomFields);

async function saveRoom(room) {
    if (!validateForm(roomFields)) {
        return;
    }

    const fileInput = document.getElementById("roomPhotoInput");
    const imageFileName = fileInput?.files[0] || null;

    const roomData = {
        name: document.getElementById("roomFullName").value.trim(),
        numberOfSeats: document.getElementById("roomNumberOfSeats").value,
        cinemaId: document.getElementById("roomOfCinema").value
    };

    try {
        const url = room ? `${BASE_PATH_ROOMS}/${room.roomId}` : BASE_PATH_ROOMS;
        const method = room ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("room", JSON.stringify(roomData));
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

            alert(room ? "Cập nhật phòng chiếu thành công!" : "Thêm phòng chiếu thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadRoomsByPage(0);

        } else {
            const errorText = await res.text();
            alert((room ? "Cập nhật" : "Thêm") + " phòng chiếu thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





