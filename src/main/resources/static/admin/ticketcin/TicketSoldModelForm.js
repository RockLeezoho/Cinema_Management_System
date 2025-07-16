function openTicketSoldForm(ticketSold) {
    const contentBody = `
    <form id="addTicketSoldNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày thanh toán</label>
          <input type="date" class="form-control" value="${ticketSold.paymentDate}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Phương thức thanh toán</label>
          <input type="text" class="form-control" value="${ticketSold.paymentMethod}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên khách hàng</label>
          <input type="text" class="form-control" value="${ticketSold.user.name}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên tài khoản khách hàng</label>
          <input type="text" class="form-control" value="${ticketSold.user.username ? ticketSold.user.username : 'Không có'}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số điện thoại khách hàng</label>
          <input type="text" class="form-control" value="${ticketSold.user.phone}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Email khách hàng</label>
          <input type="text" class="form-control" value="${ticketSold.user.email}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Loại vé</label>
          <input type="text" class="form-control" value="${ticketSold.ticketType.name}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giá vé</label>
          <input type="number" class="form-control" value="${ticketSold.ticketType.price}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Khuyến mãi áp dụng</label>
          <input type="text" class="form-control" value="${ticketSold.ticketType.voucher ? ticketSold.ticketType.voucher.title : 'Không có'}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã số chỗ ngồi</label>
          <input type="text" class="form-control" value="${ticketSold.seat.name}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Loại chỗ ngồi</label>
          <input type="text" class="form-control" value="${ticketSold.seat.seatType}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên phòng chiếu</label>
          <input type="text" class="form-control" value="${ticketSold.seat.room.name}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên rạp chiếu</label>
          <input type="text" class="form-control" value="${ticketSold.seat.room.cinema.name}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Địa chỉ rạp chiếu</label>
          <input type="text" class="form-control" value="${ticketSold.seat.room.cinema.address}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giờ bắt đầu chiếu</label>
          <input type="time" class="form-control" value="${ticketSold.showtime.startTime}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giờ kết thúc chiếu</label>
          <input type="time" class="form-control" value="${ticketSold.showtime.endTime}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày chiếu</label>
          <input type="date" class="form-control" value="${ticketSold.showtime.showDate}" readonly>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = 'Xem Thông Tin Chi Tiết Vé';
    showSharedModal(title, contentBody, null);

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







