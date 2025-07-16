function openMovieForm(movie) {
    const isEdit = movie !== null;
    const image = `
        <div class="border p-2" style="width: 150px; height: 200px; border-radius: 5px; border: 1px dashed #ccc;">
            <img id="moviePosterPreview" src="${isEdit ? movie.image : ''}"
                                   style="width: 100%; height: 100%; object-fit: cover; border-radius: 1px;">
        </div>
        <button id="movieUploadBtn" type="button" class="btn btn-sm btn-outline-primary mt-2">Upload</button>
        <input type="file" id="moviePhotoInput" class="form-control d-none" accept=".png, .jpg, .jpeg">
        <div class="mt-2 text-muted" style="font-size: 12px;">
            <i class="mb-1">Dung lượng tuối đa: 5MB</i><br>
            <i class="mb-0">Định dạng: .png, .jpg, .jpeg</i>
        </div>
    `;

    const contentBody = `
    <form id="addMovieNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên phim</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieFullName" value="${isEdit ? movie.title: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Loại phim</label>
          <select class="form-select" id="movieType" required>
              <option value="ACTION" ${isEdit && movie.type === 'ACTION' ? 'selected' : ''}>Hành động</option>
              <option value="ROMANCE" ${isEdit && movie.type === 'ROMANCE' ? 'selected' : ''}>Lãng mạn</option>
              <option value="COMEDY" ${isEdit && movie.type === 'COMEDY' ? 'selected' : ''}>Hài hước</option>
              <option value="HORROR" ${isEdit && movie.type === 'HORROR' ? 'selected' : ''}>Kinh dị</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Độ tuổi</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="number" class="form-control" id="movieAgeRating" value="${isEdit ? movie.ageRating : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Định dạng chiếu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieFormat" value="${isEdit ? movie.format : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Khởi chiếu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="date" class="form-control" id="moviePremiere" value="${isEdit ? movie.premiere : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Quốc gia</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieCountry" value="${isEdit ? movie.country : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Đạo diễn</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieDirector" value="${isEdit ? movie.director : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Diễn viên</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="moviePerformers" value="${isEdit ? movie.performers: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Thời lượng</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="number" class="form-control" id="movieDuration" value="${isEdit ? movie.duration : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Nội dung phim</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieContent" value="${isEdit ? movie.content: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Trailer</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieTrailer" value="${isEdit ? movie.trailer: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Lượt xem</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="number" class="form-control" id="movieViewer" value="${isEdit ? movie.viewer : 0}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Trạng thái phim</label>
          <select class="form-select" id="movieStatus" required>
            <option value="COMING_SOON" ${isEdit && movie.movieStatus === 'COMING_SOON' ? 'selected' : ''}>Sắp chiếu</option>
            <option value="NOW_SHOWING" ${isEdit && movie.movieStatus === 'NOW_SHOWING' ? 'selected' : ''}>Đang chiếu</option>
            <option value="STOP_SHOWING" ${isEdit && movie.movieStatus === 'STOP_SHOWING' ? 'selected' : ''}>Dừng chiếu</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập nhật thông tin phim' : 'Thêm phim';

    showSharedModal(title, contentBody, image);
    addPhoto('movieUploadBtn', 'moviePhotoInput', 'moviePosterPreview');

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveMovie(movie);
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

const movieFields = [
    { id: "movieFullName", message: "Vui lòng nhập thông tin" },
    { id: "movieType", message: "Vui lòng nhập thông tin" },
    { id: "movieFormat", message: "Vui lòng nhập thông tin" },
    { id: "movieAgeRating", message: "Vui lòng nhập thông tin" },
    { id: "moviePremiere", message: "Vui lòng nhập thông tin" },
    { id: "movieCountry", message: "Vui lòng nhập thông tin" },
    { id: "movieDirector", message: "Vui lòng nhập thông tin" },
    { id: "moviePerformers", message: "Vui lòng nhập thông tin" },
    { id: "movieDuration", message: "Vui lòng nhập thông tin" },
    { id: "movieContent", message: "Vui lòng nhập thông tin" },
    { id: "movieTrailer", message: "Vui lòng nhập thông tin" },
    { id: "movieViewer", message: "Vui lòng nhập thông tin" },
    { id: "movieStatus", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(movieFields);

async function saveMovie(movie) {
    if (!validateForm(movieFields)) {
        return;
    }

    const fileInput = document.getElementById("moviePhotoInput");
    const imageFileName = fileInput?.files[0] || null;

    const movieData = {
        title: document.getElementById("movieFullName").value.trim(),
        format: document.getElementById("movieFormat").value.trim(),
        type: document.getElementById("movieType").value.trim(),
        ageRating: document.getElementById("movieAgeRating").value.trim(),
        country: document.getElementById("movieCountry").value.trim(),
        director: document.getElementById("movieDirector").value.trim(),
        performers: document.getElementById("moviePerformers").value.trim(),
        duration: document.getElementById("movieDuration").value.trim(),
        content: document.getElementById("movieContent").value,
        trailer: document.getElementById("movieTrailer").value.trim(),
        premiere: document.getElementById("moviePremiere").value.trim(),
        viewer: document.getElementById("movieViewer").value,
        movieStatus: document.getElementById("movieStatus").value
    };

    try {
        const url = movie ? `${BASE_PATH_MOVIES}/${movie.movieId}` : BASE_PATH_MOVIES;
        const method = movie ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("movie", JSON.stringify(movieData));
        formData.append("image", imageFileName);

        console.log(movieData);
        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (res.ok) {
            const result = await res.json();

            alert(movie ? "Cập nhật phim thành công!" : "Thêm phim thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadMoviesByPage(0);
        } else {
            const errorText = await res.text();
            alert((movie ? "Cập nhật" : "Thêm") + " người dùng thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





