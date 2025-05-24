function openMovieForm(movie) {
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

    const isEdit = movie !== null;

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
            <option ${isEdit && movie.type === 'action' ? 'selected' : ''}>Hành động</option>
            <option ${isEdit && movie.type === 'romance' ? 'selected' : ''}>Lãng mạn</option>
            <option ${isEdit && movie.type === 'comedy' ? 'selected' : ''}>Hài hước</option>
            <option ${isEdit && movie.type === 'horror' ? 'selected' : ''}>Kinh dị</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Độ tuổi</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="movieAgeRating" value="${isEdit ? movie.agerating : ''}" required>
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
            <option ${isEdit && movie.moviestatus === 'now showing' ? 'selected' : ''}>Đang chiếu</option>
            <option ${isEdit && movie.moviestatus === 'coming soon' ? 'selected' : ''}>Sắp chiếu</option>
          </select>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập nhật thông tin phim' : 'Thêm phim';

    showSharedModal(title, contentBody, image);
    addPhoto();

    document.getElementById('save-btn').addEventListener('click', () => {
        saveMovie(movie);
    });
}

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


const movieFields = [
    { id: "movieFullName", message: "Vui lòng nhập thông tin" },
    { id: "movieType", message: "Vui lòng điền ngày sinh" },
    { id: "movieAgeRating", message: "Vui lòng nhập thông tin" },
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

async function savemovie(Movie) {

    // Validate form, giả sử bạn có validateForm đã định nghĩa
    if (!validateForm(movieFields)) {
        return;
    }

    const confirmPassword = document.getElementById("movieConfirm-password").value;

    // Lấy file ảnh (file input id = itemPhoto)
    const fileInput = document.getElementById("itemPhoto");
    let imageFileName = null;
    if (fileInput.files.length > 0) {
        imageFileName = fileInput.files[0].name;
        // Nếu bạn cần upload ảnh thì xử lý upload file ở đây hoặc sau
    } else if (movie && movie.image) {
        // Khi cập nhật, nếu không đổi ảnh thì giữ ảnh cũ
        imageFileName = movie.image;
    }

    const userData = {
        title: document.getElementById("movieFullName").value.trim(),
        image: imageFileName,
        type: document.getElementById("movieType").value,
        agerating: document.getElementById("movieAgeRating").value.trim(),
        country: document.getElementById("movieCountry").value.trim(),
        director: document.getElementById("movieDirector").value.trim(),
        performers: document.getElementById("moviePerformers").value.trim(),
        duration: document.getElementById("movieDuration").value.trim(),
        content: document.getElementById("movieContent").value,
        trailer: document.getElementById("movieTrailer").value.trim(),
        viewer: document.getElementById("movieViewer").value,
        moviestatus: document.getElementById("movieStatus").value
    };

    if (!movie) {
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
        const url = movie ? `${BASE_PATH_USERS}/${movie.movieId}` : BASE_PATH_USERS;
        const method = movie ? "PUT" : "POST";

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
            alert(movie ? "Cập nhật người dùng thành công!" : "Thêm người dùng thành công!");
            console.log("Kết quả:", result);

            // Tai lai trang hoặc gọi hàm tải lại dữ liệu
            window.location.reload();
        } else {
            const errorText = await res.text();
            alert((movie ? "Cập nhật" : "Thêm") + " người dùng thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





