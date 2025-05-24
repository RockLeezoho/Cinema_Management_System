//Phim moi se duoc luu vao CSDL => Lay du lieu len va hien thi

// Mở modal thêm phim
function openEmployeeForm() {
    var employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
    employeeModal.show();

    // Cập nhật ảnh xem trước và kiểm tra file tải lên
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("employeePhoto");
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

    document.getElementById("employeeModal").addEventListener("hidden.bs.modal", function () {
        document.getElementById("posterPreview").src = "https://via.placeholder.com/200x300?text=No+Image"; // Ảnh mặc định
        document.getElementById("employeePhoto").value = ""; // Reset file input
    });    
}


function saveEmployee() {
    const fields = [
        { id: "fullName", message: "Vui lòng nhập tên phim." },
        { id: "description", message: "Vui lòng nhập mô tả phim." }
    ];

    let firstInvalid = null;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const feedback = input.nextElementSibling;

        if (!input.value.trim()) {
            input.classList.add("is-invalid");
            feedback.textContent = field.message;
            if (!firstInvalid) firstInvalid = input;
        } else {
            input.classList.remove("is-invalid");
            feedback.textContent = "";
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    alert("Đã nhập đầy đủ!");
}

// Xử lý sự kiện input để ẩn cảnh báo khi người dùng nhập vào
["fullName", "description"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", function () {
        if (input.value.trim()) {
            input.classList.remove("is-invalid");
            input.nextElementSibling.textContent = "";
        }
    });
});





