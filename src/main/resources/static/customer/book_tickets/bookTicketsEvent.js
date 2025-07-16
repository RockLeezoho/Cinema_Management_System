window.ticketTimer = window.ticketTimer || {
  countdownTime: 300,
  timerInterval: null,
  isTimerRunning: false
};

document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu phim từ sessionStorage
    const movieDataRaw = sessionStorage.getItem("selectedMovie");

    if (!movieDataRaw) {
        console.error("Không tìm thấy dữ liệu phim trong sessionStorage");
        return;
    }

    try {
        const data__movie = JSON.parse(movieDataRaw);

        // Nếu bạn wrap dữ liệu trong MovieResponseDTO, cần bóc ra như sau:
        const movie = data__movie.movieDTO || data__movie;

        // Kiểm tra dữ liệu
        if (!movie || !movie.title) {
            throw new Error("Dữ liệu phim không hợp lệ");
        }

        // Gán vào các phần tử HTML
        document.getElementById("movie__poster").src = movie.image;
        document.getElementById("movie__title").innerText = movie.title;
        document.getElementById("movie__general").innerHTML = `
            <li><i class="bi bi-camera-reels"></i> ${movie.type}</li>
            <li><i class="bi bi-clock"></i> ${movie.duration}</li>
            <li><i class="bi bi-globe-central-south-asia"></i> ${movie.country}</li>
            <li><i class="bi bi-person-check"></i> Từ đủ ${movie.agerating} tuổi trở lên</li>
        `;
        document.getElementById("movie__description").innerHTML = `
            <li>Đạo diễn: ${movie.director}</li>
            <li>Diễn viên: ${movie.performers}</li>
        `;
        document.getElementById("movie__plot").innerText = movie.content;

        const trailerLink = document.getElementById("trailer__link");
        trailerLink.href = movie.trailer;
        trailerLink.target = "_blank";

        // Lưu lại vào localStorage nếu muốn dùng lâu dài
        localStorage.setItem("selected-movie", movie.title);
        localStorage.setItem("selected-ageRating", movie.ageRating);
        localStorage.setItem("selected-movie-id", movie.movieId);

        // Gọi tiếp các hàm sau khi load phim
        loadShowDates();

    } catch (error) {
        console.error("Lỗi xử lý dữ liệu phim:", error);
    }
});


function loadShowDates() {
    document.getElementById("step__date").innerHTML = `
        <h3>LỊCH CHIẾU</h3>
        <div class='d-flex' id='date__list'></div>`;

    const dateList = document.getElementById("date__list");

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

            console.log("Ngày chiếu đã chọn:", formattedDate);

            // Xóa dữ liệu cũ
            localStorage.removeItem("selected-ticketType");
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            localStorage.removeItem("selected-food");

            document.getElementById("step__ticket").innerHTML = "";
            document.getElementById("step__seat").innerHTML = "";
            document.getElementById("step__food").innerHTML = "";

            // Lưu ngày đã chọn
            // Lưu ý showDate phải format chuẩn ISO yyyy-MM-dd để backend nhận đúng
            localStorage.setItem("selected-date", new Date(futureDate).toISOString().split("T")[0]);

            // Gọi tiếp xử lý hiển thị rạp (giả sử đã có hàm này)
            loadLocations();
        };

        dateList.appendChild(btn);
    }
}


function loadLocations() {
    const movieId = localStorage.getItem("selected-movie-id");
    const selectedDate = localStorage.getItem("selected-date");

    if (!movieId || !selectedDate) {
        console.error("Thiếu thông tin movieId hoặc selectedDate");
        return;
    }

    // Chuyển đổi định dạng ngày từ "thứ hai, 27/05" về ISO date (yyyy-MM-dd)
//    const parts = selectedDate.match(/\d{2}\/\d{2}/);
//    if (!parts) {
//        console.error("Định dạng ngày không hợp lệ:", selectedDate);
//        return;
//    }

//    const [day, month] = parts[0].split('/');
//    const today = new Date();
//    const year = today.getFullYear(); // giả định là năm hiện tại
//    const isoDate = `${year}-${month}-${day}`; // yyyy-MM-dd

    fetch(`http://localhost:8080/cinpenut/booking/cinemas?movieId=${movieId}&showDate=${selectedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể tải danh sách rạp");
            }
            return response.json();
        })
        .then(cinemas => {
            if (!Array.isArray(cinemas) || cinemas.length === 0) {
                throw new Error("Không có rạp nào phù hợp.");
            }

            document.getElementById("step__location").innerHTML = `
                <h3>ĐỊA ĐIỂM</h3>
                <div class='d-flex' id='location__list'></div>
            `;

            const locationList = document.getElementById("location__list");

            cinemas.forEach(cinema => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary";
                btn.innerText = cinema.name;

                btn.onclick = function () {
                    document.querySelectorAll("#location__list button").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    console.log("Địa điểm đã chọn:", cinema.name);

                    // Reset dữ liệu cũ
                    localStorage.removeItem("selected-ticketType");
                    localStorage.removeItem("selected-single-seat");
                    localStorage.removeItem("selected-double-seat");
                    localStorage.removeItem("selected-food");

                    document.getElementById("step__ticket").innerHTML = "";
                    document.getElementById("step__seat").innerHTML = "";
                    document.getElementById("step__food").innerHTML = "";

                    // Lưu tên rạp và id rạp nếu cần
                    localStorage.setItem("selected-location", cinema.name);
                    localStorage.setItem("selected-cinema-id", cinema.cinemaId);

                    // Gọi tiếp xử lý lịch chiếu / phòng chiếu
                    loadShowtimes();
                };

                locationList.appendChild(btn);
            });
        })
        .catch(error => console.error("Lỗi tải rạp:", error));
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

function loadShowtimes() {
    const movieId = localStorage.getItem("selected-movie-id");
    const selectedDate = localStorage.getItem("selected-date");
    const cinemaId = localStorage.getItem("selected-cinema-id");

    if (!movieId || !cinemaId || !selectedDate) {
        console.error("Thiếu thông tin movieId, cinemaId hoặc selectedDate");
        return;
    }

    // Chuyển selectedDate từ "Thứ hai, 27/05" về dạng ISO yyyy-MM-dd
//    const parts = selectedDate.match(/\d{2}\/\d{2}/);
//    if (!parts) {
//        console.error("Định dạng ngày không hợp lệ:", selectedDate);
//        return;
//    }

//    const [day, month] = parts[0].split('/');
//    const year = new Date().getFullYear();
//    const isoDate = `${year}-${month}-${day}`;

    const dateStr = selectedDate;
    const [year, month, day] = dateStr.split("-");

    fetch(`http://localhost:8080/cinpenut/booking/showtimes?movieId=${movieId}&cinemaId=${cinemaId}&showDate=${selectedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể tải danh sách suất chiếu");
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Không có suất chiếu nào phù hợp.");
            }

            document.getElementById("step__showtime").innerHTML = `
                <h3>SUẤT CHIẾU</h3>
                <div class='d-flex flex-wrap gap-2' id='showtime__list'></div>
            `;
            const showtimeList = document.getElementById("showtime__list");

            const now = new Date();
            const isToday = now.getDate() === parseInt(day) && (now.getMonth() + 1) === parseInt(month);
            const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

            data.forEach(showtimeObj => {
                const showtime = showtimeObj.startTime; //vi du "15:30"
                const [hours, minutes] = showtime.split(":").map(Number);
                const showtimeInMinutes = hours * 60 + minutes;

                // Nếu là hôm nay, chỉ hiện những suất sau thời điểm hiện tại
                if (isToday && showtimeInMinutes <= currentTimeInMinutes) {
                    return;
                }

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

                    document.getElementById("step__ticket").innerHTML = "";
                    document.getElementById("step__seat").innerHTML = "";
                    document.getElementById("step__food").innerHTML = "";

                    // Lưu dữ liệu mới
                    localStorage.setItem("selected-showtime", showtime);
                    localStorage.setItem("selected-showtime-id", showtimeObj.showtimeId); // nếu API trả về id suất chiếu
                    localStorage.setItem("selected-room-id", showtimeObj.roomId);
                    localStorage.setItem("selected-room-name", showtimeObj.roomName);
                    loadTicketTypes();
                };

                showtimeList.appendChild(btn);
            });
        })
        .catch(error => console.error("Lỗi tải suất chiếu:", error));
}

function loadTicketTypes() {
    loadPaymentInfor();

    fetch("http://localhost:8080/cinpenut/booking/tickettypes")
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể tải danh sách loại vé");
            }
            return response.json(); // trả về dữ liệu ticketTypes ở đây
        })
        .then(ticketTypes => {
            // Đặt dòng này ở đây - ticketTypes đã tồn tại
            localStorage.setItem("ticket-types", JSON.stringify(ticketTypes));

            if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
                throw new Error("Không có dữ liệu loại vé");
            }

            document.getElementById("step__ticket").innerHTML = `
                <h3>CHỌN LOẠI VÉ</h3>
                <div class='d-flex flex-wrap gap-3' id='ticket__list'></div>
            `;

            const ticketList = document.getElementById("ticket__list");

            ticketTypes.forEach(ticket => {
                const divTicket = document.createElement("div");
                divTicket.className = "ticket__card";

                // Xác định loại vé
                let typeId = 'adult';
                const name = ticket.name.toLowerCase();
                if (name.includes("hssv") || name.includes("cao tuổi")) {
                    typeId = 'student';
                } else if (name.includes("đôi")) {
                    typeId = 'double';
                }

                divTicket.innerHTML = `
                    <h6 class="ticket__type">${ticket.name}</h6>
                    <div class="ticket__price">${ticket.price.toLocaleString()} VND</div>
                    <div class="counter-container ticket__container">
                        <button class="counter-btn" onclick="decreaseCounter('${typeId}-${ticket.ticketTypeId}')">-</button>
                        <span class="counter-value" id="${typeId}-${ticket.ticketTypeId}__count">0</span>
                        <button class="counter-btn" onclick="increaseCounter('${typeId}-${ticket.ticketTypeId}')">+</button>
                    </div>
                `;

                // Lưu từng loại vé vào localStorage (nếu cần)
                // Có thể thay bằng lưu tập thể như trên
                localStorage.setItem("selected-tickeType-id", ticket.ticketTypeId);

                ticketList.appendChild(divTicket);
            });
        })
        .catch(error => console.error("Lỗi tải loại vé:", error));
}


function fetchConcessions(cinemaId) {
    return fetch(`http://localhost:8080/cinpenut/booking/concessions?cinemaId=${cinemaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi lấy dữ liệu bắp nước.");
            }
            return response.json();
        });
}


function increaseCounter(typeId) {
    const countElement = document.getElementById(`${typeId}__count`);
    if (!countElement) {
        console.error(`Không tìm thấy phần tử đếm với ID: ${typeId}__count`);
        return;
    }

    let count = parseInt(countElement.innerText) || 0;
    count++;
    countElement.innerText = count;

    const ticketTypes = ["adult", "student", "double"];
    const [baseType, baseId] = typeId.split("-"); // ví dụ: "adult-5" → baseType: "adult", baseId: "5"

    if (ticketTypes.includes(baseType)) {
        // Tạo lại danh sách typeId từ ticketTypes + id nếu cần
        const ticketTypeIds = [];
        document.querySelectorAll(`[id$="__count"]`).forEach(el => {
            const id = el.id.replace("__count", "");
            if (ticketTypes.includes(id.split("-")[0])) {
                ticketTypeIds.push(id);
            }
        });

        updateSession(ticketTypeIds, "ticketType");
    } else {
        const cinemaId = localStorage.getItem("selected-cinema-id");
        if (!cinemaId) {
            console.error("Không tìm thấy cinemaId trong localStorage.");
            return;
        }

        fetchConcessions(cinemaId)
            .then(concessions => {
                if (!Array.isArray(concessions)) {
                    throw new Error("Dữ liệu trả về không hợp lệ.");
                }

                const foodTypeIds = concessions.map(item => `${item.type}-${item.concessionId}`);
                updateSession(foodTypeIds, "food");
            })
            .catch(error => console.error("Lỗi tải bắp nước:", error));
    }
}

function decreaseCounter(typeId) {
    // Tìm đúng phần tử đếm (theo định dạng ID: "type-id__count")
    const countElement = document.getElementById(`${typeId}__count`);
    if (!countElement) {
        console.error(`Không tìm thấy phần tử đếm với ID: ${typeId}__count`);
        return;
    }

    let count = parseInt(countElement.innerText) || 0;
    if (count > 0) {
        count--;
        countElement.innerText = count;
    }

    const ticketTypes = ["adult", "student", "double"];
    const [baseType, baseId] = typeId.split("-"); // ví dụ: combo-101 → baseType: combo

    if (ticketTypes.includes(baseType)) {
        // Lấy tất cả type-id liên quan đến vé trong DOM
        const ticketTypeIds = [];
        document.querySelectorAll(`[id$="__count"]`).forEach(el => {
            const id = el.id.replace("__count", "");
            if (ticketTypes.includes(id.split("-")[0])) {
                ticketTypeIds.push(id);
            }
        });

        updateSession(ticketTypeIds, "ticketType");
    } else {
        const cinemaId = localStorage.getItem("selected-cinema-id");
        if (!cinemaId) {
            console.error("Không tìm thấy cinemaId trong localStorage.");
            return;
        }

        fetchConcessions(cinemaId)
            .then(concessions => {
                if (!Array.isArray(concessions)) {
                    throw new Error("Dữ liệu trả về không hợp lệ.");
                }

                const foodTypeIds = concessions.map(item => `${item.type}-${item.concessionId}`);
                updateSession(foodTypeIds, "food");
            })
            .catch(error => console.error("Lỗi tải bắp nước:", error));
    }
}

function updateSession(itemTypeIds, session) {
    let selectedItems = [];

    const ticketTypes = session === "ticketType"
        ? JSON.parse(localStorage.getItem("ticket-types")) || []
        : [];

    itemTypeIds.forEach(typeId => {
        const countEl = document.getElementById(`${typeId}__count`);
        if (!countEl) {
            console.warn(`Không tìm thấy phần tử đếm: ${typeId}__count`);
            return;
        }

        const count = parseInt(countEl.innerText) || 0;
        if (count <= 0) return;

        const [type, id] = typeId.split("-");

        const item = {
            type: type,
            quantity: count
        };

        if (id) item.id = parseInt(id);

        if (session === "ticketType") {
            const ticketInfo = ticketTypes.find(ticket => {
                const name = ticket.name.toLowerCase();
                if (type === "student") return name.includes("hssv") || name.includes("sinh viên");
                if (type === "double") return name.includes("đôi");
                return name.includes(type);
            });
            item.price = ticketInfo ? ticketInfo.price : 0;
        }

        selectedItems.push(item);
    });

    localStorage.setItem(`selected-${session}`, JSON.stringify(selectedItems));
    console.log(`[updateSession] ${session}:`, selectedItems);

    if (session === "ticketType") {
        if (selectedItems.length > 0) {
            // Nếu DOM payment__info chưa có, nghĩa là giao diện chưa render, thì tạo
            if (!document.getElementById("payment-ticket")) {
                loadPaymentInfor();
            }
            loadSeats();
            updatePaymentInfo();
        } else {
            // Xóa dữ liệu ghế và đồ ăn khi không còn vé nào
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            localStorage.removeItem("selected-food");

            // Xóa nội dung UI nếu có
            const seatStep = document.getElementById("step__seat");
            const foodStep = document.getElementById("step__food");
            const paymentInfo = document.getElementById("payment__info");

            if (seatStep) seatStep.innerHTML = "";
            if (foodStep) foodStep.innerHTML = "";
            if (paymentInfo) paymentInfo.innerHTML = "";

            alert("Vui lòng chọn ít nhất một vé trước khi chọn ghế!");
        }
    } else {
        // Với đồ ăn, chỉ update nếu DOM vẫn còn
        if (document.getElementById("payment-total")) {
            updatePaymentInfo();
        }
    }
}



// Ánh xạ loại ghế từ dữ liệu backend → class CSS
function getSeatCssClass(seatType) {
    switch (seatType) {
        case "COUPLE":
            return "double";
        case "STANDARD":
            return "normal";
        default:
            return "normal"; // fallback nếu có loại khác
    }
}

async function loadSeats() {
    const selectedRoom = localStorage.getItem("selected-room-name") || "Phòng chưa chọn";
    const selectedRoomId = localStorage.getItem("selected-room-id");
    const selectedShowtimeId = localStorage.getItem("selected-showtime-id");
    const selectedShowDate = localStorage.getItem("selected-date");

    if (!selectedRoomId || !selectedShowtimeId || !selectedShowDate) {
        alert("Thông tin rạp, suất chiếu hoặc ngày chiếu chưa được chọn.");
        return;
    }

    const seatTitle = `CHỌN GHẾ - ${selectedRoom.toUpperCase()}`;
    document.getElementById("step__seat").innerHTML = `
        <h3>${seatTitle}</h3>
        <h4>Màn hình</h4>
        <div class='d-flex flex-wrap' id='seat__list'></div>
    `;

    const seatList = document.getElementById("seat__list");

    // Lấy số lượng vé từng loại
    let singleSeatsCount = 0;
    let doubleSeatsCount = 0;
    let selectedSingleSeats = JSON.parse(localStorage.getItem("selected-single-seat") || "[]");
    let selectedDoubleSeats = JSON.parse(localStorage.getItem("selected-double-seat") || "[]");

    const selectedTickets = JSON.parse(localStorage.getItem("selected-ticketType")) || [];
    if (selectedTickets.length === 0) {
        alert("Bạn cần chọn loại vé trước khi chọn ghế!");
        return;
    }

    selectedTickets.forEach(ticket => {
        if (ticket.type === "adult" || ticket.type === "student") {
            singleSeatsCount += ticket.quantity;
        } else if (ticket.type === "double") {
            doubleSeatsCount += ticket.quantity;
        }
    });

    try {


        const response = await fetch(`http://localhost:8080/cinpenut/booking/seats/status?showtimeId=${selectedShowtimeId}&roomId=${selectedRoomId}&showDate=${selectedShowDate}`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Không thể tải trạng thái ghế");
        }

        const seatStatusList = await response.json();
        seatList.innerHTML = "";

        let currentRow = "";
        seatStatusList.forEach(seat => {
            const rowLetter = seat.name.charAt(0);
            if (rowLetter !== currentRow) {
                currentRow = rowLetter;
                const rowLabel = document.createElement("div");
                rowLabel.className = "seat__row__label";
                rowLabel.innerText = rowLetter;
                seatList.appendChild(rowLabel);
            }

            const btn = document.createElement("button");
            btn.className = "btn btn-outline-primary m-1";
            btn.innerText = seat.name;

            if (seat.booked) {
                btn.classList.add("disabled", "booked");
                btn.setAttribute("disabled", true);
            } else {
                btn.classList.remove("disabled", "booked");
                btn.removeAttribute("disabled");
                btn.onclick = () => {
                    const isDouble = seat.seatType === "COUPLE";

                    if (isDouble) {
                        if (selectedDoubleSeats.includes(seat.name)) {
                            selectedDoubleSeats = selectedDoubleSeats.filter(s => s !== seat.name);
                            btn.classList.remove("active");
                        } else if (selectedDoubleSeats.length < doubleSeatsCount) {
                            selectedDoubleSeats.push(seat.name);
                            btn.classList.add("active");
                        } else {
                            alert(`Bạn chỉ được chọn tối đa ${doubleSeatsCount} ghế đôi.`);
                        }
                    } else {
                        if (selectedSingleSeats.includes(seat.name)) {
                            selectedSingleSeats = selectedSingleSeats.filter(s => s !== seat.name);
                            btn.classList.remove("active");
                        } else if (selectedSingleSeats.length < singleSeatsCount) {
                            selectedSingleSeats.push(seat.name);
                            btn.classList.add("active");
                        } else {
                            alert(`Bạn chỉ được chọn tối đa ${singleSeatsCount} ghế đơn.`);
                        }
                    }

                    console.log("Ghế đơn đã chọn:", selectedSingleSeats);
                    console.log("Ghế đôi đã chọn:", selectedDoubleSeats);
                    localStorage.setItem("selected-single-seat", JSON.stringify(selectedSingleSeats));
                    localStorage.setItem("selected-double-seat", JSON.stringify(selectedDoubleSeats));
                    updatePaymentInfo();
                    checkAndStartCountdown();
                };

                // Nếu ghế đã được chọn trước đó, đánh dấu active luôn
                if ((seat.seatType === "double" && selectedDoubleSeats.includes(seat.name)) ||
                    (seat.seatType !== "double" && selectedSingleSeats.includes(seat.name))) {
                    btn.classList.add("active");
                }
            }

            // Style theo loại ghế
            btn.classList.add(getSeatCssClass(seat.seatType));

            seatList.appendChild(btn);
        });

        // Hiển thị chú thích
        const legend = document.createElement("div");
        legend.className = "legend__seat row mt-3";
        legend.innerHTML = `
            <div class="col d-flex align-items-center">
                <div class="box normal"></div>
                <span class="ms-2">Ghế thường</span>
            </div>
            <div class="col d-flex align-items-center">
                <div class="box double"></div>
                <span class="ms-2">Ghế đôi</span>
            </div>
            <div class="col d-flex align-items-center">
                <div class="box selected"></div>
                <span class="ms-2">Ghế chọn</span>
            </div>
            <div class="col d-flex align-items-center">
                <div class="box booked"></div>
                <span class="ms-2">Ghế đã đặt</span>
            </div>
        `;
        seatList.appendChild(legend);

        loadFoods();

    } catch (error) {
        console.error("Lỗi tải trạng thái ghế:", error);
        alert("Lỗi tải trạng thái ghế: " + error.message);
    }
}

// Kiểm tra nếu có ghế được chọn thì mới bắt đầu đếm ngược
function checkAndStartCountdown() {
    let selectedSeats = JSON.parse(localStorage.getItem("selected-single-seat") || "[]");
    let selectedDoubleSeats = JSON.parse(localStorage.getItem("selected-double-seat") || "[]");

    if (selectedSeats.length > 0 || selectedDoubleSeats.length > 0) {
        if (!window.ticketTimer.isTimerRunning) startCountdown();
    } else {
        clearInterval(window.ticketTimer.timerInterval);
        window.ticketTimer.isTimerRunning = false;
        document.getElementById("payment-timer").innerText = "Chưa bắt đầu";
    }
}

function startCountdown() {
    window.ticketTimer.isTimerRunning = true;
    window.ticketTimer.countdownTime = 300;
    document.getElementById("payment-timer").innerText = formatTime(window.ticketTimer.countdownTime);

    window.ticketTimer.timerInterval = setInterval(() => {
        window.ticketTimer.countdownTime--;
        document.getElementById("payment-timer").innerText = formatTime(window.ticketTimer.countdownTime);

        if (window.ticketTimer.countdownTime <= 0) {
            clearInterval(window.ticketTimer.timerInterval);
            alert("Thời gian giữ vé đã hết! Vui lòng chọn lại ghế.");
            window.ticketTimer.isTimerRunning = false;
            localStorage.removeItem("selected-single-seat");
            localStorage.removeItem("selected-double-seat");
            loadSeats();
        }
    }, 1000);
}

function confirmBooking() {
    clearInterval(window.ticketTimer.timerInterval); // Dừng đếm ngược khi đặt vé
    window.ticketTimer.isTimerRunning = false;
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
        <h3>CHỌN ĐỒ TẠI RẠP</h3>
        <div class="d-flex flex-wrap" id="food__list"></div>
    `;

    const foodList = document.getElementById("food__list");

    // Lấy cinemaId từ localStorage hoặc bạn có thể thay bằng giá trị phù hợp
    const cinemaId = localStorage.getItem("selected-cinema-id") || 1;

    fetch(`http://localhost:8080/cinpenut/booking/concessions?cinemaId=${cinemaId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Không thể tải dữ liệu sản phẩm");
        }
        return response.json();
    })
    .then(concessions => {
        if (!Array.isArray(concessions) || concessions.length === 0) {
            throw new Error("Không có dữ liệu sản phẩm");
        }

        // Lưu danh sách đồ ăn vào localStorage để dùng tính tổng tiền
        localStorage.setItem("food-data", JSON.stringify(concessions));

        concessions.forEach(item => {
            // Giả sử ConcessionDTO có các trường: id, name, price, image, type
            let foodItem = document.createElement("div");
            foodItem.className = "food__card";
            foodItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h6 class="mt-2 food__title">${item.name}</h6>
                <div class="food__price">${item.sellingPrice.toLocaleString()} VND</div>
                <div class="counter-container food__container">
                    <button class="counter-btn" onclick="decreaseCounter('${item.type}-${item.concessionId}')">-</button>
                    <span class="counter-value" id="${item.type}-${item.concessionId}__count">0</span>
                    <button class="counter-btn" onclick="increaseCounter('${item.type}-${item.concessionId}')">+</button>
                </div>
            `;
            foodList.appendChild(foodItem);
        });
    })
    .catch(error => {
        console.error("Lỗi tải dữ liệu:", error);
        foodList.innerHTML = "<p>Không tải được danh sách sản phẩm.</p>";
    });
}


function calculateTotalPrice(tickets, foods) {
    let totalPrice = 0;

    try {
        const ticketTypesList = JSON.parse(localStorage.getItem("ticket-types")) || [];
        if (!Array.isArray(ticketTypesList) || ticketTypesList.length === 0) {
            throw new Error("Danh sách loại vé trong localStorage không hợp lệ");
        }

        // In ra để kiểm tra key name đúng hay không
        console.log("Danh sách loại vé:", ticketTypesList);

        // Tạo map loại vé: { "adult": 90000, "student": 70000, "double": 150000 }
        const ticketTypeMap = {};

        ticketTypesList.forEach(type => {
            if (type.name.includes("Người lớn") && type.name.includes("đơn")) {
                ticketTypeMap["adult"] = type.price;
            } else if (type.name.includes("HSSV") || type.name.includes("cao tuổi")) {
                ticketTypeMap["student"] = type.price;
            } else if (type.name.includes("đôi")) {
                ticketTypeMap["double"] = type.price;
            }
        });

        console.log("Ticket Type Map:", ticketTypeMap);

        // Tính tiền vé
        tickets.forEach(ticket => {
            if (!ticket || typeof ticket.quantity !== 'number') return;

            const pricePerTicket = ticketTypeMap[ticket.type] || 0;
            totalPrice += ticket.quantity * pricePerTicket;
        });

        console.log("Tien ve:", totalPrice);

        // Lấy dữ liệu đồ ăn từ localStorage
        const foodDataFromLocal = JSON.parse(localStorage.getItem("food-data")) || [];

        // Tính tiền đồ ăn
        foods.forEach(food => {
            if (!food || typeof food.quantity !== 'number') return;

        foodDataFromLocal.forEach((c, i) => {
            console.log(` Món ăn ${i + 1}: id=${c.id}, name=${c.name}, type=${c.type}`);
        });
            const foundFood = foodDataFromLocal.find(f => f.concessionId === food.id);
            if (foundFood) {
                const price = foundFood.sellingPrice || foundFood.price || 0;
                totalPrice += food.quantity * price;
            }
        });

        return Math.round(totalPrice);

    } catch (error) {
        console.error("Lỗi khi tính tổng tiền:", error);
        return 0;
    }
}




async function getFoodText(selectedFoods) {
    try {
        const cinemaId = localStorage.getItem("selected-cinema-id");
        const response = await fetch(`http://localhost:8080/cinpenut/booking/concessions?cinemaId=${cinemaId}`);
        if (!response.ok) throw new Error("Không thể tải dữ liệu bắp nước");

        const concessions = await response.json();
        if (!Array.isArray(concessions)) throw new Error("Dữ liệu trả về không hợp lệ");
        concessions.forEach((c, i) => {
            console.log(`Món ${i + 1}: id=${c.id}, name=${c.name}, type=${c.type}`);
        });

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
    let selectedTickets = JSON.parse(localStorage.getItem("selected-ticketType")) || [];
    let selectedSeats1 = JSON.parse(localStorage.getItem("selected-single-seat")) || [];
    let selectedSeats2 = JSON.parse(localStorage.getItem("selected-double-seat")) || [];
    let selectedFoodsRaw = JSON.parse(localStorage.getItem("selected-food")) || [];
     console.log(selectedFoodsRaw);

     let selectedFoods = Array.isArray(selectedFoodsRaw)
         ? selectedFoodsRaw
         : Object.values(selectedFoodsRaw);

    let ticketText = selectedTickets.map(ticket => {
        if (ticket.type === "adult") return `Người lớn - đơn x${ticket.quantity}`;
        if (ticket.type === "student") return `HSSV/người cao tuổi - đơn x${ticket.quantity}`;
        if (ticket.type === "double") return `Người lớn - đôi x${ticket.quantity}`;
        return "";
    }).join(", ");

    let seatText = [...selectedSeats1, ...selectedSeats2].join(", ");
    let foodText = await getFoodText(selectedFoods);

    console.log('Sản phẩm: '+ foodText);

    // let totalPrice = calculateTotalPrice(selectedTickets, selectedFoods);
    let totalPrice = await calculateTotalPrice(selectedTickets, selectedFoods);
    console.log(totalPrice);

    document.getElementById("payment-ticket").innerText = ticketText;
    document.getElementById("payment-seats").innerText = seatText;
    document.getElementById("payment-food").innerText = foodText;
    document.getElementById("payment-total").innerText = totalPrice.toLocaleString() + " VND";
    localStorage.setItem("total-price",totalPrice);
}

function loadPaymentInfor () {
    document.getElementById("payment__info").innerHTML = `
    <h3>THÔNG TIN THANH TOÁN</h3>
    <div class="booking__info">
    <p><strong class="me-3">Phim:</strong> <span id="payment-movie">${localStorage.getItem("selected-movie")}</span></p>
    <p><strong class="me-3">Địa điểm:</strong> <span id="payment-location">${localStorage.getItem("selected-location")}</span></p>
    <p><strong class="me-3">Phòng chiếu:</strong> <span id="payment-room">${localStorage.getItem("selected-room-name")}</span></p>
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



