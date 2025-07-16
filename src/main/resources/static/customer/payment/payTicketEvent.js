//document.addEventListener("DOMContentLoaded", loadPaymentInfor);

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
        const cinemaId = localStorage.getItem("selected-cinema-id");
        const response = await fetch(`http://localhost:8080/cinpenut/booking/concessions?cinemaId=${cinemaId}`);
        if (!response.ok) throw new Error("Không thể tải dữ liệu bắp nước");

        const concessions = await response.json();
        if (!Array.isArray(concessions)) throw new Error("Dữ liệu trả về không hợp lệ");

        return selectedFoods.length > 0
            ? selectedFoods.map(food => {
                const found = concessions.find(c => c.concessionId === food.id);
                return found ? `${found.name} x${food.quantity}` : "";
            }).filter(text => text !== "").join(", ")
            : "Không chọn";
    } catch (error) {
        console.error("Lỗi tải dữ liệu bắp nước:", error);
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
    let room = localStorage.getItem("selected-room-name") || "Chưa chọn phòng";
    let showtime = localStorage.getItem("selected-showtime") || "Chưa chọn suất";
    let totalPrice = localStorage.getItem("total-price") || 0;
    console.log(localStorage.getItem("total-price"));


    // Hiển thị thông tin trên trang thanh toán
    document.getElementById("form__title").innerHTML = 
    `<strong class="me-3">${movie}</strong>`;
    document.getElementById("holding__time").innerHTML = `<p><strong class="me-3 text-danger">Thời gian giữ vé:</strong> <span id="payment-timer">Chưa bắt đầu</span></p>`;
    document.getElementById("ticket__details").innerHTML = `
        <li class="location"><strong class="me-3">Rạp chiếu:</strong><span id="payment__cinema">${cinema}</span></li>
        <li class="age__rating"><strong class="me-3">Giới hạn độ tuổi:</strong><span id="payment__age">${ageRating}T</span></li>
        <li class="date__time"><strong class="me-3">Thời gian:</strong><span class="payment__time">${showtime}, ${date}</span></li>
        <li class="room"><strong class="me-3">Phòng chiếu:</strong><span class="payment__room">${room}</span></li>
        <li class="ticket__type"><strong class="me-3">Loại vé:</strong><span id="payment__ticket"></span></li>
        <li class="seat"><strong class="me-3">Ghế:</strong><span id="payment__seat"></span></li>
        <li class="food"><strong class="me-3">Đồ ăn:</strong><span id="payment__food"></span></li>
        <li class="total__price"><strong class="me-3">TỔNG SỐ TIỀN CẦN THANH TOÁN:</strong>${totalPrice}VND</li>
    `;

    updatePaymentInfo();
    startCountdown();

//    // Xử lý nút thanh toán
//    document.getElementById("continuous__payment").addEventListener("click", function () {
//        alert("Thanh toán thành công! Cảm ơn bạn đã đặt vé.");
//        clearLocalStorage();
//        window.location.href = "index.html"; // Chuyển về trang chủ
//    });

document.getElementById("continuous__payment").addEventListener("click", async function () {
//    try {
        // Lấy dữ liệu từ localStorage
        const singleSeats = JSON.parse(localStorage.getItem("selected-single-seat")) || [];
        const doubleSeats = JSON.parse(localStorage.getItem("selected-double-seat")) || [];

        // Lấy tên ghế đầu tiên từ single seat hoặc double seat (ưu tiên single)
        const selectedSeatName = singleSeats.length > 0
            ? singleSeats[0]
            : (doubleSeats.length > 0 ? doubleSeats[0] : null);

        const bookingDetail = {
            customerName: document.getElementById("customerName").value.trim() || "",     // nhập từ form
            customerPhone: document.getElementById("customerPhone").value.trim() || "",
            customerEmail: document.getElementById("customerEmail").value.trim() || "",

            paymentMethod: "VNPay", // hoặc lấy từ dropdown
            paymentDate: new Date().toISOString().split("T")[0], // format yyyy-MM-dd

            showtimeId: parseInt(localStorage.getItem("selected-showtime-id")), // Long

            ticketTypeId: parseInt(localStorage.getItem("selected-ticketType-id")),

            selectedSeatName: selectedSeatName,

            concessionsId: (JSON.parse(localStorage.getItem("selected-food")) || []).map(food => ({
                id: food.id,
                quantity: food.quantity
            })),

            totalPrice: localStorage.getItem("total-price").toLocaleString() || "0"
        };

        console.log(JSON.stringify(bookingDetail));

        // Gửi POST request tới backend tạo thanh toán
        const response = await fetch("http://localhost:8080/cinpenut/booking/payment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingDetail)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Tạo thanh toán thất bại");
        }

        const data = await response.json();
        const paymentUrl = data.paymentUrl;

        // Chuyển hướng tới VNPay
        window.location.href = paymentUrl;

//    } catch (error) {
//        alert("Lỗi thanh toán: " + error.message);
//        console.error("Thanh toán lỗi:", error);
//    }
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
