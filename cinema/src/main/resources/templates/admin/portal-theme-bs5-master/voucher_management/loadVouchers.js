document.addEventListener("DOMContentLoaded", function () {
    fetch("voucherList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#vouchersAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((voucher, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${voucher.voucher_id}</td>
                    <td>${voucher.start_time}</td>
                    <td>${voucher.end_time}</td>
                    <td>${voucher.condition}</td>
                    <td>${voucher.description}</td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Sửa</a></td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xóa</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
