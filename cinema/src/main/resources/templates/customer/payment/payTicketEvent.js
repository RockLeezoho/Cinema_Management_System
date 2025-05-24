function startCountdown() {
    isTimerRunning = true;
    countdownTime = 300; 
    document.getElementById("payment-timer").innerText = formatTime(countdownTime);

    timerInterval = setInterval(() => {
        countdownTime--;
        document.getElementById("payment-timer").innerText = formatTime(countdownTime);

        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            alert("Thời gian giữ vé đã hết! Vui lòng chọn lại các thông tin.");
            isTimerRunning = false;
            localStorage.removeItem("selected-movie");
            localStorage.removeItem("selected-date");
            localStorage.removeItem("selected-location");
            localStorage.removeItem("selected-room");
            localStorage.removeItem("selected-showtime");
            localStorage.removeItem("selected-ticketType");
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            localStorage.removeItem("selected-food");
            localStorage.removeItem("total-price");
        }
    }, 1000);
}
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

async function getFoodText(selectedFoods) {
    try {
        let response = await fetch("../book_tickets/data.json");
        let data__movie = await response.json();

        console.log("Dữ liệu từ JSON:", data__movie); // Kiểm tra dữ liệu

        return selectedFoods.length > 0 
            ? selectedFoods.map(food => {
                let foundFood = Object.entries(data__movie.foods)
                    .find(([name, details]) => details.type === food.type);
                return foundFood ? `${foundFood[0]} x${food.quantity}` : "";
            }).join(", ") 
            : "Không chọn";
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        return "Không chọn";
    }
}

async function updatePaymentInfo() {
    let ticketType = JSON.parse(localStorage.getItem("selected-ticketType")) || [];
    let singleSeat = JSON.parse(localStorage.getItem("selected-single-seat")) || [];
    let doubleSeat = JSON.parse(localStorage.getItem("selected-double-seat")) || [];
    let food = JSON.parse(localStorage.getItem("selected-food")) || [];

    let ticketText = ticketType.map(ticket => {
        if (ticket.type === "adult") return `Người lớn - đơn x${ticket.quantity}`;
        if (ticket.type === "student") return `HSSV/người cao tuổi - đơn x${ticket.quantity}`;
        if (ticket.type === "double") return `Người lớn - đôi x${ticket.quantity}`;
        return "";
    }).join(", ");

    let seatText = [...singleSeat, ...doubleSeat].join(", ");
    let foodText = await getFoodText(food);

    console.log(ticketText);
    console.log(seatText);

    document.getElementById("payment__ticket").innerText = ticketText;
    document.getElementById("payment__seat").innerText = seatText;
    document.getElementById("payment__food").innerText = foodText;
}

document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu từ localStorage
    let movie = localStorage.getItem("selected-movie") || "Chưa chọn phim";
    let ageRating = localStorage.getItem("selected-ageRating") || "Chưa có thông tin";
    let date = localStorage.getItem("selected-date") || "Chưa chọn ngày";
    let cinema = localStorage.getItem("selected-location") || "Chưa chọn địa điểm rạp";
    let room = localStorage.getItem("selected-room") || "Chưa chọn phòng";
    let showtime = localStorage.getItem("selected-showtime") || "Chưa chọn suất";
    let totalPrice = localStorage.getItem("total-price") || 0;
    console.log(localStorage.getItem("total-price"));

    // Hiển thị thông tin trên trang thanh toán
    document.getElementById("form__title").innerHTML = 
    `<strong class="me-3">${movie}</strong>`;
    document.getElementById("holding__time").innerHTML = `<p><strong class="me-3 text-danger">Thời gian giữ vé:</strong> <span id="payment-timer">Chưa bắt đầu</span></p>`;
    document.getElementById("ticket__details").innerHTML = `
        <li class="age__rating"><span id="payment__age">${ageRating}</span></li>
        <li class="location"><strong class="me-3"><span id="payment__cinema">${cinema}</span></strong></li>
        <li class="date__time"><strong class="me-3">Thời gian:</strong><span class="payment__time">${showtime}, ${date}</span></li>
        <li class="room"><strong class="me-3">Phòng chiếu:</strong><span class="payment__room">${room}</span></li>
        <li class="ticket__type"><strong class="me-3">Loại vé:</strong><span id="payment__ticket"></span></li>
        <li class="seat"><strong class="me-3">Ghế:</strong><span id="payment__seat"></span></li>
        <li class="food"><strong class="me-3">Đồ ăn:</strong><span id="payment__food"></span></li>
        <li class="total__price"><strong class="me-3">TỔNG SỐ TIỀN CẦN THANH TOÁN:</strong>${totalPrice},000VND</li>
    `;

    updatePaymentInfo();
    startCountdown();

    // Xử lý nút thanh toán
    document.getElementById("continuous__payment").addEventListener("click", function () {
        alert("Thanh toán thành công! Cảm ơn bạn đã đặt vé.");
        clearLocalStorage();
        window.location.href = "index.html"; // Chuyển về trang chủ
    });

    // Theo dõi thay đổi trong localStorage
    window.addEventListener("storage", (event) => {
        console.log("Dữ liệu thay đổi:", event);
    });
});

// Xóa dữ liệu khi thoát khỏi trang thanh toán
window.addEventListener("beforeunload", function () {
    clearLocalStorage();
});

// Hàm xóa dữ liệu trong localStorage
function clearLocalStorage() {
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("ticketType");
    localStorage.removeItem("movieTitle");
    localStorage.removeItem("cinemaName");
    localStorage.removeItem("showtime");
    localStorage.removeItem("totalPrice");
}
