document.addEventListener("DOMContentLoaded", function () {
    fetch("cinemaList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#cinemasAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((cinema, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${cinema.title}</td>
                    <td><img src="${cinema.image}" width="50"></td>
                    <td>${cinema.location}</td>
                    <td class="cell">
                        <a class="btn-sm app-btn-secondary view-rooms" 
                           href="rooms.html?cinema_id=${index + 1}">Danh sách phòng</a>
                    </td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Sửa</a></td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xóa</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
