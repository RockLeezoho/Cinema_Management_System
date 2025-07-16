function openTicketTypeForm(ticketType) {
    const isEdit = ticketType !== null;
    const contentBody = `
    <form id="addTicketTypeNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên loại vé</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="ticketTypeFullName" value="${isEdit ? ticketType.name: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Giá loại vé</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <div class="input-group">
            <input type="number" class="form-control" id="ticketTypePrice" value="${isEdit ? ticketType.price : ''}" step="1" min="0" required>
            <span class="input-group-text">VND</span>
          </div>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã khuyến mại</label>
          <input type="text" class="form-control" id="ticketTypeVoucherId" value="${isEdit ? ticketType.voucherId : ''}">
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Loại Vé' : 'Thêm Loại Vé';

    showSharedModal(title, contentBody, null);

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveTicketType(ticketType);
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

const ticketTypeFields = [
    { id: "ticketTypeFullName", message: "Vui lòng nhập thông tin" },
    { id: "ticketTypePrice", message: "Vui lòng nhập thông tin" },
    { id: "ticketTypeVoucherId", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(ticketTypeFields);

async function saveTicketType(ticketType) {
    if (!validateForm(ticketTypeFields)) {
        return;
    }

    const ticketTypeData = {
        name: document.getElementById("ticketTypeFullName").value.trim(),
        price: Number(document.getElementById("ticketTypePrice").value),
        voucherId: document.getElementById("ticketTypeVoucherId").value
    };

    try {
        const url = ticketType ? `${BASE_PATH_TICKETTYPES}/${ticketType.ticketTypeId}` : BASE_PATH_TICKETTYPES;
        const method = ticketType ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticketTypeData)
        });

        if (res.ok) {
            const result = await res.json();

            alert(ticketType ? "Cập nhật loại vé thành công!" : "Thêm loại vé thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadTicketTypesByPage(0);

        } else {
            const errorText = await res.text();
            alert((ticketType ? "Cập nhật" : "Thêm") + " loại vé thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





