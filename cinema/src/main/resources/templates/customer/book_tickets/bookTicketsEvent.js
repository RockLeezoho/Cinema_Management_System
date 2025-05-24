let countdownTime = 300; // 5 phút (300 giây)
let timerInterval = null;
let isTimerRunning = false;
document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể tải data.json");
            }
            return response.json();
        }
        )
        .then(data__movie => {
            if(!data__movie || !data__movie.movie){
                throw new Error("Dữ liệu không hợp lệ");
            }

            const movie = data__movie.movie;
            document.getElementById("movie__poster").src = movie.poster;
            document.getElementById("movie__title").innerText = movie.title;
            document.getElementById("movie__general").innerHTML = `
                <li><i class="bi bi-camera-reels"></i> ${movie.genre}</li>
                <li><i class="bi bi-clock"></i> ${movie.duration}</li>
                <li><i class="bi bi-globe-central-south-asia"></i> ${movie.country}</li>
                <li><i class="bi bi-person-check"></i> ${movie.age_rating}</li>
            `;
            document.getElementById("movie__description").innerHTML = `
                <li>Đạo diễn: ${movie.director}</li>
                <li>Diễn viên: ${movie.performers}</li>
            `;
            document.getElementById("movie__plot").innerText = movie.plot;
            
            const trailerLink = document.getElementById("trailer__link");
            trailerLink.href = movie.trailer;
            trailerLink.target = "_blank";

            //Luu tru du lieu vao localStorage
            localStorage.setItem("selected-movie", movie.title);
            localStorage.setItem("selected-ageRating", movie.age_rating);

            loadShowDates();
        })
        .catch(error => console.error("Lỗi tải dữ liệu:", error));
});

function loadShowDates() {
    fetch("data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Không thể tải data.json");
        }
        return response.json();
    }
    )
    .then(() => {
        document.getElementById("step__date").innerHTML = `
        <h3>LỊCH CHIẾU</h3>
        <div class='d-flex' id='date__list'></div>`;
        const dateList = document.getElementById("date__list");
        // dateList.innerHTML = "";
                
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            
            const formattedDate = futureDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit"
            });
            
            const btn = document.createElement("button");
            btn.className = "btn btn-outline-primary";
            btn.innerText = formattedDate;
            btn.onclick = function () {
                document.querySelectorAll("#date__list button").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                console.log("Ngày chiếu đã chọn:", formattedDate); // Gia gui ve server

                // Reset dữ liệu cũ
                localStorage.removeItem("selected-ticketType");
                localStorage.removeItem("selected-single-seat");
                localStorage.removeItem("selected-double-seat");
                localStorage.removeItem("selected-food");


                document.getElementById("step__ticket").innerHTML = ""; // Xóa UI loại vé
                document.getElementById("step__seat").innerHTML = ""; // Xóa UI chọn ghế
                document.getElementById("step__food").innerHTML = ""; // Xóa UI chọn đồ ăn
        
                // Luu tru du lieu vao localStorage
                localStorage.setItem("selected-date", formattedDate);

                loadLocations();
            };
            
            dateList.appendChild(btn);
        }
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
}

function loadLocations() {
    fetch("data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Không thể tải data.json");
        }
        return response.json();
    }
    )
    .then(data__movie => {
        if(!data__movie || !data__movie.locations){
            throw new Error("Dữ liệu không hợp lệ");
        }
        document.getElementById("step__location").innerHTML = "<h3>ĐỊA ĐIỂM</h3><div class='d-flex' id='location__list'></div>";
    const locationList = document.getElementById("location__list"); // Hien thi chon dia diem
    // locationList.innerHTML = "";

    Object.keys(data__movie.locations).forEach(city => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-primary";
        btn.innerText = city;
            
        btn.onclick = function () {
            document.querySelectorAll("#location__list button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            console.log("Địa điểm đã chọn:", city);

            // Reset dữ liệu cũ
            localStorage.removeItem("selected-ticketType");
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            localStorage.removeItem("selected-food");


            document.getElementById("step__ticket").innerHTML = ""; // Xóa UI loại vé
            document.getElementById("step__seat").innerHTML = ""; // Xóa UI chọn ghế
            document.getElementById("step__food").innerHTML = ""; // Xóa UI chọn đồ ăn
            
            // Lưu vào localStorage
            localStorage.setItem("selected-location", city);

            // Gọi hàm tiếp theo để hiển thị
            loadShowtimes();

            // Gọi hàm tiếp theo để hiển thị phòng chiếu
//            loadRooms();
        };

        locationList.appendChild(btn);
        });
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
}

//function loadRooms() {
//    fetch("data.json")
//    .then(response => {
//        if(!response.ok){
//            throw new Error("Không thể tải data.json");
//        }
//        return response.json();
//    })
//    .then(data__movie => {
//        if(!data__movie || !data__movie.locations){
//            throw new Error("Dữ liệu không hợp lệ");
//        }
//        document.getElementById("step__room").innerHTML = "<h3>PHÒNG CHIẾU</h3><div class='d-flex' id='room__list'></div>";
//        const roomList = document.getElementById("room__list");
//
//        data__movie.locations[localStorage.getItem("selected-location")].forEach(room => {
//            const btn = document.createElement("button");
//            btn.className = "btn btn-outline-primary";
//            btn.innerText = room;
//
//            btn.onclick = function(){
//                document.querySelectorAll("#room__list button").forEach(b => b.classList.remove("active"));
//                btn.classList.add("active");
//
//                console.log("Phòng chiếu đã chọn:", );
//
//                // Reset dữ liệu cũ
//                localStorage.removeItem("selected-ticketType");
//                localStorage.removeItem("selected-single-seat");
//                localStorage.removeItem("selected-double-seat");
//                localStorage.removeItem("selected-food");
//
//
//                document.getElementById("step__ticket").innerHTML = ""; // Xóa UI loại vé
//                document.getElementById("step__seat").innerHTML = ""; // Xóa UI chọn ghế
//                document.getElementById("step__food").innerHTML = ""; // Xóa UI chọn đồ ăn
//
//                //Luu vao localStorage
//                localStorage.setItem("selected-room", room);
//
//                // Goi ham tiep theo
//                loadShowtimes();
//            };
//            roomList.appendChild(btn);
//        })
//    })
//    .catch(error => console.error("Lỗi tải dữ liệu:", error));
//}

function isToday(inpDate) {
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;

    const match = inpDate.match(/\d{2}\/\d{2}/);
    if(!match) return false; // ko tim thay dung dinh dang
    return todayStr === match[0];
}

function loadShowtimes(){
    fetch("data.json")
    .then(response => {
        if(!response.ok){
            throw new Error("Không thể tải data.json");
        }
        return response.json();
    })
    .then(data__movie => {
        if(!data__movie || !data__movie.showtimes){
            throw new Error("Dữ liệu không hợp lệ");
        }
        document.getElementById("step__showtime").innerHTML = "<h3>SUẤT CHIẾU</h3><div class='d-flex' id='showtime__list'></div>";
        const showtimeList = document.getElementById("showtime__list");
        // showtimeList.innerHTML = "";

        const now = new Date();
        let timeNow = now.getHours() * 60 + now.getMinutes();
        const upcomingShowtimes = !isToday(localStorage.getItem("selected-date")) ? data__movie.showtimes : data__movie.showtimes.filter(time => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes > timeNow;
        });

        // console.log(upcomingShowtimes);

        upcomingShowtimes.forEach(showtime => {
            const btn = document.createElement("button");
            btn.className = "btn btn-outline-primary";
            btn.innerText = showtime;

            btn.onclick = function () {
                document.querySelectorAll("#showtime__list button").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
    
                console.log("Suất chiếu đã chọn:", showtime);

                // Reset dữ liệu cũ
                localStorage.removeItem("selected-ticketType");
                localStorage.removeItem("selected-single-seat");
                localStorage.removeItem("selected-double-seat");
                localStorage.removeItem("selected-food");


                document.getElementById("step__ticket").innerHTML = ""; // Xóa UI loại vé
                document.getElementById("step__seat").innerHTML = ""; // Xóa UI chọn ghế
                document.getElementById("step__food").innerHTML = ""; // Xóa UI chọn đồ ăn
    
                //Luu du lieu moi vao localStorage
                localStorage.setItem("selected-showtime", showtime);

                //Goi ham tiep
                loadTicketTypes();
            };

            showtimeList.appendChild(btn);
        });

    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
}

function loadTicketTypes() {
    loadPaymentInfor();
    fetch("data.json")
    .then(response => {
        if(!response.ok){
            throw new Error("Không thể tải dữ liệu");
        }
        return response.json();
    })
    .then(data__movie => {
        if(!data__movie || !data__movie.ticketTypes){
            throw new Error("Dữ liệu không hợp lệ");
        }
        document.getElementById("step__ticket").innerHTML = `
        <h3>CHỌN LOẠI VÉ</h3>
        <div class='d-flex' id='ticket__list'></div>

        `;
        const ticketList = document.getElementById("ticket__list");
        Object.entries(data__movie.ticketTypes).forEach(([ticket, price]) =>{
            const divTicket = document.createElement("div");
            divTicket.className = "ticket__card";
            let typeId = 'adult';
            if(ticket.includes("HSSV") || ticket.includes("người cao tuổi")){
                typeId = 'student';
            }
            else if(ticket.includes("đôi")){
                typeId = 'double';
            }
            
            divTicket.innerHTML = `
                <h6 class="ticket__type">${ticket}</h6>
                <div class="ticket__price">${price.toLocaleString()},000 VND</div>
                <div class="counter-container ticket__container">
                    <button class="counter-btn" onclick="decreaseCounter('${typeId}')">-</button>
                    <span class="counter-value" id="${typeId}__count">0</span>
                    <button class="counter-btn" onclick="increaseCounter('${typeId}')">+</button>
                </div>
            `;

            ticketList.appendChild(divTicket);
        });
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
}

function increaseCounter(typeId) {
    const countElement = document.getElementById(`${typeId}__count`);
    let count = parseInt(countElement.innerText) || 0;
    countElement.innerText = count + 1;
    const ticketTypes = ["adult", "student", "double"];
    fetch("data.json")
    .then(response => response.json())
    .then(data => {
        const foodTypes = Object.values(data.foods).map(food => food.type);
        // console.log(foodKeys); 
        if(typeId.includes("adult") || typeId.includes("student") || typeId.includes("double")){
            updateSession(ticketTypes, "ticketType");
        }
        else{
            updateSession(foodTypes, "food");
        }
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));

}

function decreaseCounter(typeId) {
    const countElement = document.getElementById(`${typeId}__count`);
    let count = parseInt(countElement.innerText) || 0;
    if (count > 0) {
        countElement.innerText = count - 1;
    }
    const ticketTypes = ["adult", "student", "double"];
    fetch("data.json")
    .then(response => response.json())
    .then(data => {
        const foodTypes = Object.values(data.foods).map(food => food.type);
        // console.log(foodKeys); 
        if(typeId.includes("adult") || typeId.includes("student") || typeId.includes("double")){
            updateSession(ticketTypes, "ticketType");
        }
        else{
            updateSession(foodTypes, "food");
        }
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
}

function updateSession(itemTypes, session) {
    let selectedItems = [];

    itemTypes.forEach(typeId => {
        const countEl = document.getElementById(`${typeId}__count`);
        if (!countEl) {
            console.error(`Không tìm thấy phần tử: ${typeId}__count`);
            return;
        }
        const count = parseInt(countEl.innerText) || 0;
        if (count > 0) {
            selectedItems.push({ type: typeId, quantity: count});

            console.log(selectedItems);
        }
    });
    localStorage.setItem(`selected-${session}`, JSON.stringify(selectedItems));

    console.log(selectedItems);

    if(session.includes("ticketType")){
        if (selectedItems.length > 0){
            loadSeats();  // Chỉ gọi khi đã chọn ít nhất một vé
        } else {
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            localStorage.removeItem("selected-food");
            document.getElementById("step__seat").innerHTML = "";  // Xóa giao diện chọn ghế
            document.getElementById("step__food").innerHTML = "";
            document.getElementById("payment__info").innerHTML = "";
            alert("Vui lòng chọn ít nhất một vé trước khi chọn ghế!"); // Cảnh báo
        }
    }

    updatePaymentInfo();
}


function loadSeats() {
    const selectedRoom = localStorage.getItem("selected-room") || "Phòng chưa chọn";
    const seatTitle = `CHỌN GHẾ` +  ` - ` +  `${selectedRoom.toUpperCase()}`;
    document.getElementById("step__seat").innerHTML = `
    <h3>${seatTitle}</h3>
    <h4>Màn hình</h4>
    <div class='d-flex' id='seat__list'></div>
    `;

    const seatList = document.getElementById("seat__list");


    // Giả lập ghế đã đặt từ server
    const bookedSeats = ["A01", "A05", "B03", "C07", "C08", "C09", "D04", "D07", "D10"]; 

    // So ve da dat
    let singleSeatsCount = 0; // Số ghế đơn khách chọn
    let doubleSeatsCount = 0; // Số ghế đôi khách chọn (tính theo cặp)
    let selectedSingleSeats = [];
    let selectedDoubleSeats = [];

    let selectedTickets = JSON.parse(localStorage.getItem("selected-ticketType")) || [];

    if (selectedTickets.length === 0) {
        alert("Bạn cần chọn loại vé trước khi chọn ghế!");
        return; // Dừng hàm nếu chưa chọn vé
    }

    selectedTickets.forEach(ticket => {
        if(ticket.type == "adult" || ticket.type == "student"){
            singleSeatsCount += ticket.quantity;
        }
        else if(ticket.type == "double"){
            doubleSeatsCount += ticket.quantity;
        }
    });

    console.log(singleSeatsCount);

    seatList.innerHTML = ""; // Xóa danh sách cũ
    fetch("data.json")
    .then(response => {
        if(!response.ok){
            throw new Error("Không thể tải dữ liệu");
        }
        return response.json();
    })
    .then(data__movie => {
        if(!data__movie || !data__movie.seats){
            throw new Error("Dữ liệu không hợp lệ");
        }

        let label = "A";
        let rowLabel = document.createElement("div");
        rowLabel.className = "seat__row__label";
        rowLabel.innerText = label;
        seatList.appendChild(rowLabel);

        Object.entries(data__movie.seats).forEach(([seat, status]) => {
            if(label !== seat[0]){
                rowLabel = document.createElement("div");
                rowLabel.className = "seat__row__label";
                rowLabel.innerText = seat[0];
                seatList.appendChild(rowLabel);
                label = seat[0];
            }
            const btn = document.createElement("button");
            btn.className = "btn btn-outline-primary " + label;
            btn.innerText = seat;


            if(bookedSeats.includes(seat.trim())){
                status = 1; // Gia lap 
                btn.classList.add("disabled"); // Thêm class 'disabled' de doi style
                btn.setAttribute("disabled", true); // Không thể bấm
            }
            else {
                btn.onclick = function () {
                    // Xác định đây là ghế đơn hay đôi
                    const isDoubleSeat = seat.includes("E");

                    if (isDoubleSeat) {
                        // Ghế đôi
                        if (selectedDoubleSeats.length < doubleSeatsCount) {
                            if (selectedDoubleSeats.includes(seat)) {
                                selectedDoubleSeats = selectedDoubleSeats.filter(s => s !== seat);
                                btn.classList.remove("active");
                            } else {
                                selectedDoubleSeats.push(seat);
                                btn.classList.add("active");
                            }
                        } else {
                            alert(`Bạn chỉ có thể chọn tối đa ${doubleSeatsCount} ghế đôi.`);
                        }
                    } else {
                        // Ghế đơn
                        if (selectedSingleSeats.length < singleSeatsCount) {
                            if (selectedSingleSeats.includes(seat)) {
                                selectedSingleSeats = selectedSingleSeats.filter(s => s !== seat);
                                btn.classList.remove("active");
                            } else {
                                selectedSingleSeats.push(seat);
                                btn.classList.add("active");
                            }
                        } else {
                            alert(`Bạn chỉ có thể chọn tối đa ${singleSeatsCount} ghế đơn.`);
                        }
                    }

                    console.log("Ghế đơn đã chọn:", selectedSingleSeats);
                    console.log("Ghế đôi đã chọn:", selectedDoubleSeats);

                    localStorage.setItem("selected-single-seat", JSON.stringify(selectedSingleSeats));
                    localStorage.setItem("selected-double-seat", JSON.stringify(selectedDoubleSeats));

                    updatePaymentInfo();
                    checkAndStartCountdown(); // Gọi kiểm tra đếm ngược sau khi chọn ghế
                };
            }
            seatList.appendChild(btn);
        });
        const legend = document.createElement("div");
        legend.className = "legend__seat row";
        legend.innerHTML = `
            <div class="col d-flex">
                <div class="box normal"></div>
                <span class="ms-2">Ghế thường</span>
            </div>
            <div class="col d-flex">
                <div class="box double"></div>
                <span class="ms-2">Ghế đôi</span>
            </div>
            <div class="col d-flex">
                <div class="box selected"></div>
                <span class="ms-2">Ghế chọn</span>
            </div>
            <div class="col d-flex">
                <div class="box booked"></div>
                <span class="ms-2">Ghế đã đặt</span>
            </div>
        `;
        seatList.appendChild(legend);
        loadFoods();
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
    
}

// Kiểm tra nếu có ghế được chọn thì mới bắt đầu đếm ngược
function checkAndStartCountdown() {
    let selectedSeats = JSON.parse(localStorage.getItem("selected-single-seat") || "[]");
    let selectedDoubleSeats = JSON.parse(localStorage.getItem("selected-double-seat") || "[]");

    if (selectedSeats.length > 0 || selectedDoubleSeats.length > 0) {
        if (!isTimerRunning) startCountdown();
    } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        document.getElementById("payment-timer").innerText = "Chưa bắt đầu";
    }
}

function startCountdown() {
    isTimerRunning = true;
    countdownTime = 300; 
    document.getElementById("payment-timer").innerText = formatTime(countdownTime);

    timerInterval = setInterval(() => {
        countdownTime--;
        document.getElementById("payment-timer").innerText = formatTime(countdownTime);

        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            alert("Thời gian giữ vé đã hết! Vui lòng chọn lại ghế.");
            isTimerRunning = false;
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            loadSeats();
        }
    }, 1000);
}

function confirmBooking() {
    clearInterval(timerInterval); // Dừng đếm ngược khi đặt vé
    isTimerRunning = false;
    // Thêm logic lưu vé vào hệ thống hoặc chuyển hướng trang tại đây
    window.location.href = "../payment/payTicket.html"; // Chuyển sang trang thanh toán
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function loadFoods() {
    document.getElementById("step__food").innerHTML = `
        <h3>CHỌN ĐỒ ĂN</h3>
        <div class="d-flex" id="food__list"></div>
    `;

    const foodList = document.getElementById("food__list");

    fetch("data.json")
    .then(response => {
        if(!response.ok){
            throw new Error("Không thể tải dữ liệu");
        }
        return response.json();
    })
    .then(data__movie => {
        if(!data__movie || !data__movie.foods){
            throw new Error("Dữ liệu không hợp lệ");
        }

        Object.entries(data__movie.foods).forEach(([food, detail]) => {
            let foodItem = document.createElement("div");
            foodItem.className = "food__card";
            foodItem.innerHTML = `
                <img src="${detail.image}", alt="${food}">
                <h6 class="mt-2 food__title">${food}</h6>
                <div class="food__price">${detail.price.toLocaleString()},000 VND</div>
                <div class="counter-container food__container">
                    <button class="counter-btn" onclick="decreaseCounter('${detail.type}')">-</button>
                    <span class="counter-value" id="${detail.type}__count">0</span>
                    <button class="counter-btn" onclick="increaseCounter('${detail.type}')">+</button>
                </div>
            `;
            foodList.appendChild(foodItem); 
        });
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
}


async function calculateTotalPrice(tickets, foods) {
    let totalPrice = 0;
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Không thể tải dữ liệu");

        const data__movie = await response.json();
        if (!data__movie || !data__movie.ticketTypes) throw new Error("Dữ liệu không hợp lệ");

        // Tính tiền vé
        tickets.forEach(ticket => {
            if (ticket.type === "adult") {
                totalPrice += ticket.quantity * (data__movie.ticketTypes)["Người lớn - đơn"];
            } else if (ticket.type === "student") {
                totalPrice += ticket.quantity * (data__movie.ticketTypes)["HSSV/người cao tuổi-đơn"];
            } else {
                totalPrice += ticket.quantity * (data__movie.ticketTypes)["Người lớn-đôi"];
            }
        });

        // Tính tiền đồ ăn
        foods.forEach(food => {
            let foundFood = Object.values(data__movie.foods).find(f => f.type === food.type);
            if (foundFood) {
                totalPrice += food.quantity * foundFood.price;
            }
        });

        return totalPrice;  
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        return 0;  // Nếu lỗi, trả về 0 thay vì undefined
    }
}

async function getFoodText(selectedFoods) {
    try {
        let response = await fetch("data.json");
        let data__movie = await response.json();

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
    let selectedTickets = JSON.parse(localStorage.getItem("selected-ticketType")) || [];
    let selectedSeats1 = JSON.parse(localStorage.getItem("selected-single-seat")) || [];
    let selectedSeats2 = JSON.parse(localStorage.getItem("selected-double-seat")) || [];
    let selectedFoods = JSON.parse(localStorage.getItem("selected-food")) || [];
    // console.log(`day la ${selectedTickets}`);

    let ticketText = selectedTickets.map(ticket => {
        if (ticket.type === "adult") return `Người lớn - đơn x${ticket.quantity}`;
        if (ticket.type === "student") return `HSSV/người cao tuổi - đơn x${ticket.quantity}`;
        if (ticket.type === "double") return `Người lớn - đôi x${ticket.quantity}`;
        return "";
    }).join(", ");

    let seatText = [...selectedSeats1, ...selectedSeats2].join(", ");
    let foodText = await getFoodText(selectedFoods);

    // let totalPrice = calculateTotalPrice(selectedTickets, selectedFoods);
    let totalPrice = await calculateTotalPrice(selectedTickets, selectedFoods);
    console.log(totalPrice);

    document.getElementById("payment-ticket").innerText = ticketText;
    document.getElementById("payment-seats").innerText = seatText;
    document.getElementById("payment-food").innerText = foodText;
    document.getElementById("payment-total").innerText = totalPrice.toLocaleString() + ",000" + " VND";
    localStorage.setItem("total-price",totalPrice);
}

function loadPaymentInfor () {
    let countdownTime = 300; // 5 phút (300 giây)

    document.getElementById("payment__info").innerHTML = `
    <h3>THÔNG TIN THANH TOÁN</h3>
    <div class="booking__info">
    <p><strong class="me-3">Phim:</strong> <span id="payment-movie">${localStorage.getItem("selected-movie")}</span></p>
    <p><strong class="me-3">Địa điểm:</strong> <span id="payment-location">${localStorage.getItem("selected-location")}</span></p>
    <p><strong class="me-3">Phòng chiếu:</strong> <span id="payment-room">${localStorage.getItem("selected-room")}</span></p>
    <p><strong class="me-3">Ngày chiếu:</strong> <span id="payment-date">${localStorage.getItem("selected-date")}</span></p>
    <p><strong class="me-3">Suất chiếu:</strong> <span id="payment-showtime">${localStorage.getItem("selected-showtime")}</span></p>
    <p><strong class="me-3">Loại vé:</strong> <span id="payment-ticket"></span></p>
    <p><strong class="me-3">Ghế:</strong> <span id="payment-seats"></span></p>
    <p><strong class="me-3">Đồ ăn:</strong> <span id="payment-food"></span></p>
    <p><strong class="me-3">Tạm tính:</strong> <span id="payment-total">0 VND</span></p>
    <p><strong class="me-3 text-danger">Thời gian giữ vé:</strong> <span id="payment-timer">Chưa bắt đầu</span></p>
    <button class="btn btn-primary btn-lg" onclick="confirmBooking()">ĐẶT VÉ</></button>
    </div>
    `;
    updatePaymentInfo();
}



