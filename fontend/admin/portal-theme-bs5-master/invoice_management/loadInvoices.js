document.addEventListener("DOMContentLoaded", function () {
    fetch("invoiceList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#invoicesAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((invoice, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${invoice.customer_account}</td>
                    <td>${invoice.product}</td>
                    <td>${invoice.price}</td>
                    <td>${invoice.quantity}</td>
                    <td>${invoice.special_offer}</td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xem chi tiết</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
