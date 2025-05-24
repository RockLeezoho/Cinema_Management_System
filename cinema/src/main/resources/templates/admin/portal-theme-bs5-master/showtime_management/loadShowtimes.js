document.addEventListener("DOMContentLoaded", function () {
    fetch("showtimesList.json") // Đọc file JSON
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#showtimesAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((showtime, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${showtime.start_time}</td>
                    <td>${showtime.end_time}</td>
                    <td>${showtime.cinema_id}</td>
                    <td>${showtime.room_id}</td>
                    <td>${showtime.movie_id}</td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Sửa</a></td>
                    <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xóa</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu:", error));
});
