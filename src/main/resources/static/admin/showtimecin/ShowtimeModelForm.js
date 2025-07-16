function openShowtimeForm(showtime) {
    const isEdit = showtime !== null;

    const contentBody = `
    <form id="addShowtimeNewForm">
      <div class="row">
       <div class="col-md-6 mb-3">
          <label class="form-label">Giờ bắt đầu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input
            type="time"
            class="form-control"
            id="showtimeStartTime"
            name="showtimeStartTime"
            value="${isEdit ? showtime.startTime : ''}"
            required
            step="60"
          >
          <div class="invalid-feedback"></div>
       </div>
       <div class="col-md-6 mb-3">
          <label class="form-label">Ngày chiếu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="date" class="form-control" style="color: #5A5A63" id="showtimeShowDate" value="${isEdit ? showtime.showDate : ''}" required>
          <div class="invalid-feedback"></div>
       </div>
       <div class="col-md-6 mb-3">
            <label class="form-label">Giờ kết thúc</label>
            <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
            <input
            type="time"
            class="form-control"
            id="showtimeEndTime"
            name="showtimeEndTime"
            value="${isEdit ? showtime.endTime : ''}"
            required
            step="60"
            >
            <div class="invalid-feedback"></div>
       </div>
       <div class="col-md-6 mb-3">
            <label class="form-label">Mã phim</label>
            <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
            <input type="text" class="form-control" id="showtimeMovieId" value="${isEdit ? showtime.movieId : ''}" required>
            <div class="invalid-feedback"></div>
       </div>
       <div class="col-md-6 mb-3">
            <label class="form-label">Mã phòng chiếu</label>
            <input type="text" class="form-control" id="showtimeRoomId" value="${isEdit ? showtime.roomId : ''}">
            <div class="invalid-feedback"></div>
       </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Lịch Chiếu' : 'Thêm Lịch Chiếu';

    showSharedModal(title, contentBody, null);

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveShowtime(showtime);
    });

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

const showtimeFields = [
    { id: "showtimeStartTime", message: "Vui lòng nhập thông tin" },
    { id: "showtimeEndTime", message: "Vui lòng nhập thông tin" },
    { id: "showtimeShowDate", message: "Vui lòng nhập thông tin" },
    { id: "showtimeMovieId", message: "Vui lòng nhập thông tin" },
    { id: "showtimeRoomId", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(showtimeFields);

async function saveShowtime(showtime) {
    if (!validateForm(showtimeFields)) {
        return;
    }

    const showtimeData = {
        startTime: document.getElementById("showtimeStartTime").value,
        endTime: document.getElementById("showtimeEndTime").value,
        showDate: document.getElementById("showtimeShowDate").value,
        movieId: document.getElementById("showtimeMovieId").value,
        roomId: document.getElementById("showtimeRoomId").value
    };

    try {
        const url = showtime ? `${BASE_PATH_SHOWTIMES}/${showtime.showtimeId}` : BASE_PATH_SHOWTIMES;
        const method = showtime ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(showtimeData)
        });

        if (res.ok) {
            const result = await res.json();

            alert(showtime ? "Cập nhật lịch chiếu thành công!" : "Thêm lịch chiếu thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadShowtimesByPage(0);

        } else {
            const errorText = await res.text();
            alert((showtime ? "Cập nhật" : "Thêm") + " lịch chiếu thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





