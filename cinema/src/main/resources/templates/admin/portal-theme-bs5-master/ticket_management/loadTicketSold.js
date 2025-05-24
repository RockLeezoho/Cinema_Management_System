document.addEventListener("DOMContentLoaded", function () {
    fetch("ticketSoldList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#ticketSoldsAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((ticket_sold, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${ticket_sold.customer_account}</td>
                    <td>${ticket_sold.name}</td>
                    <td>${ticket_sold.price}</td>
                    <td>${ticket_sold.special_offer}</td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xem chi tiết</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
