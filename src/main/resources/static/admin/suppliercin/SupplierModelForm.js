function openSupplierForm(supplier) {
    const isEdit = supplier !== null;

    const contentBody = `
    <form id="addSupplierNewForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên nhà cung cấp</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="supplierFullName" value="${isEdit ? supplier.name: ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Địa chỉ</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="supplierAddress" value="${isEdit ? supplier.address : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số điện thoại</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="supplierPhone" value="${isEdit ? supplier.phone : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Hợp đồng bắt đầu</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="date" class="form-control" style="color: #5A5A63" id="supplierContractStartDate" value="${isEdit ? supplier.contractStartDate : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Các sản phẩm cung cấp</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="text" class="form-control" id="supplierSuppliedItems" value="${isEdit ? supplier.suppliedItems : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Hợp đồng kết thúc</label>
          <i class="bi bi-asterisk position-absolute" style="color:red;font-size:6px;margin-left:7px;"></i>
          <input type="date" class="form-control" style="color: #5A5A63" id="supplierContractEndDate" value="${isEdit ? supplier.contractEndDate : ''}" required>
          <div class="invalid-feedback"></div>
        </div>
      </div>
    </form>
    `;

    const title = isEdit ? 'Cập Nhật Thông Tin Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp';

    showSharedModal(title, contentBody, null);

    const saveBtn = document.getElementById('save-btn');
    const clonedSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(clonedSaveBtn, saveBtn);

    clonedSaveBtn.addEventListener('click', () => {
        saveSupplier(supplier);
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

const supplierFields = [
    { id: "supplierFullName", message: "Vui lòng nhập thông tin" },
    { id: "supplierAddress", message: "Vui lòng nhập thông tin" },
    { id: "supplierPhone", message: "Vui lòng nhập thông tin" },
    { id: "supplierSuppliedItems", message: "Vui lòng nhập thông tin" },
    { id: "supplierContractStartDate", message: "Vui lòng nhập thông tin" },
    { id: "supplierContractEndDate", message: "Vui lòng nhập thông tin" }
];

attachRealtimeValidation(supplierFields);

async function saveSupplier(supplier) {
    if (!validateForm(supplierFields)) {
        return;
    }

    const supplierData = {
        name: document.getElementById("supplierFullName").value.trim(),
        address: document.getElementById("supplierAddress").value.trim(),
        phone: document.getElementById("supplierPhone").value.trim(),
        suppliedItems: document.getElementById("supplierSuppliedItems").value.trim(),
        contractStartDate: document.getElementById("supplierContractStartDate").value,
        contractEndDate: document.getElementById("supplierContractEndDate").value
    };

    try {
        const url = supplier ? `${BASE_PATH_SUPPLIERS}/${supplier.supplierId}` : BASE_PATH_SUPPLIERS;
        const method = supplier ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(supplierData)
        });

        if (res.ok) {
            const result = await res.json();

            alert(supplier ? "Cập nhật nhà cung cấp thành công!" : "Thêm nhà cung cấp thành công!");
            document.querySelector(".btn-close")?.click(); // đóng modal
            await loadSuppliersByPage(0);

        } else {
            const errorText = await res.text();
            alert((supplier ? "Cập nhật" : "Thêm") + " nhà cung cấp thất bại: " + errorText);
        }
    } catch (e) {
        console.error("Lỗi gửi yêu cầu:", e);
        alert("Không thể kết nối đến máy chủ.");
    }
}





