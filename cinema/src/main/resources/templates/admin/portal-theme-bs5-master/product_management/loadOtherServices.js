document.addEventListener("DOMContentLoaded", function () {
    fetch("otherServiceList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#otherServicesAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((service, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${service.title}</td>
                    <td><img src=${service.image}></td>
                    <td>${service.type}</td>
                    <td>${service.quantity}</td>
                    <td>${service.price}</td>
                    <td>${service.special_offer}</td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Sửa</a></td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xóa</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
