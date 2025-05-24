document.addEventListener("DOMContentLoaded", function () {
    fetch("ticketTypeList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#ticketTypesAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((ticket_type, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${ticket_type.name}</td>
                    <td>${ticket_type.price}</td>
                    <td>${ticket_type.special_offer}</td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Sửa</a></td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xóa</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
