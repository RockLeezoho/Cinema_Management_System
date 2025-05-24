//Phim moi se duoc luu vao CSDL => Lay du lieu len va hien thi

// Mở modal thêm phim
function openMovieForm() {
    var movieModal = new bootstrap.Modal(document.getElementById("movieModal"));
    movieModal.show();

    // Cập nhật ảnh xem trước và kiểm tra file tải lên
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("moviePoster");
    const posterPreview = document.getElementById("posterPreview");
    
    uploadBtn.onclick = function () {
        fileInput.value = ""; // Đảm bảo onchange luôn kích hoạt
        fileInput.click();
    };

    fileInput.onchange = function (event) {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
            if (!allowedTypes.includes(file.type)) {
                alert("Định dạng file không hợp lệ! Chỉ chấp nhận PNG, JPG, JPEG.");
                fileInput.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.");
                fileInput.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                posterPreview.src = e.target.result;
                console.log("Ảnh xem trước đã cập nhật.");
            };
            reader.readAsDataURL(file);
        }
    };

    document.getElementById("movieModal").addEventListener("hidden.bs.modal", function () {
        document.getElementById("posterPreview").src = "https://via.placeholder.com/200x300?text=No+Image"; // Ảnh mặc định
        document.getElementById("moviePoster").value = ""; // Reset file input
    });    
}


function saveEmployee() {
    const fields = [
        { id: "fullName", message: "Vui lòng nhập tên phim." },
        { id: "phoneNumber", message: "Vui lòng nhập mô tả phim." }
    ];

    let firstInvalid = null;

    for (let field of fields) {
        const element = document.getElementById(field.id);
        const feedback = element.nextElementSibling;

        if (!element.value.trim()) {
            element.classList.add("is-invalid");
            feedback.textContent = field.message;

            if (!firstInvalid) {
                firstInvalid = element;
            }
        } else {
            element.classList.remove("is-invalid");
            feedback.textContent = "";
        }
    }

    const photo = document.getElementById("employeePhoto");
    const photoFeedback = document.getElementById("photoFeedback");

    if (!photo.files || photo.files.length === 0) {
        photo.classList.add("is-invalid");
        photoFeedback.textContent = "Vui lòng chọn ảnh poster.";
        if (!firstInvalid) {
            firstInvalid = photo;
        }
    } else {
        photo.classList.remove("is-invalid");
        photoFeedback.textContent = "";
    }

    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    // Dữ liệu hợp lệ
    alert("Đã nhập đầy đủ. Tiến hành lưu...");
}

