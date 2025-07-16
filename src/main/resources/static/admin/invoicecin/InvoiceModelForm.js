function openInvoiceForm(invoice) {
    const contentBody = `
    <form id="addInvoiceNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày thanh toán</label>
          <input type="date" class="form-control" value="${invoice.paymentDate}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Phương thức thanh toán</label>
          <input type="text" class="form-control" value="${invoice.paymentMethod}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên khách hàng</label>
          <input type="text" class="form-control" value="${invoice.user.name}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên tài khoản khách hàng</label>
          <input type="text" class="form-control" value="${invoice.user.username ? invoice.user.username : 'Không có'}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số điện thoại khách hàng</label>
          <input type="text" class="form-control" value="${invoice.user.phone}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Email khách hàng</label>
          <input type="text" class="form-control" value="${invoice.user.email}" readonly>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-12 mb-3">
          <label class="form-label fw-bold">Danh sách sản phẩm đã mua:</label>
          <div class="table-responsive">
            <table class="table table-bordered table-sm">
              <thead class="table-light">
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Loại</th>
                  <th>Giá (VND)</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.concessions.map(c => `
                  <tr>
                    <td>${c.name}</td>
                    <td>${c.type}</td>
                    <td>${c.sellingPrice.toLocaleString()}</td>
                    <td>${c.quantity}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </form>
    `;

    const title = 'Xem Thông Tin Chi Tiết Hóa Đơn';
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







