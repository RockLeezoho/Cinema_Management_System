document.addEventListener("DOMContentLoaded", function () {
    //  Lấy ID rạp từ URL
    const params = new URLSearchParams(window.location.search);
    const cinemaId = params.get("cinema_id");

    if (!cinemaId) {
        alert("Không tìm thấy rạp!");
        return;
    }

    // Cập nhật tiêu đề trang
    document.getElementById("cinemaTitle").innerText = `Phòng chiếu Của Rạp ${cinemaId}`;

    //  Đọc danh sách phòng từ JSON
    fetch("roomList.json")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#roomsAll tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            console.log("Dữ liệu từ JSON:", data);

            //  Lọc danh sách phòng theo cinema_id
            const filteredRooms = data.filter(room => room.cinema_id == Number(cinemaId));

            if (filteredRooms.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4">Không có phòng nào</td></tr>`;
                return;
            }

            //  Hiển thị danh sách phòng
            filteredRooms.forEach((room, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${room.number}</td>
                        <td>${room.seats}</td>
                        <td>${room.position}</td>
                        <td class="cell">
                            <a class="btn-sm app-btn-secondary view-seats"
                               href="seats.html?room_id=${index + 1}">Danh sách ghế</a>
                        </td>
                        <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Sửa</a></td>
                        <td class="cell"><a class="btn-sm app-btn-secondary" href="#">Xóa</a></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Lỗi khi tải danh sách phòng:", error));
});
