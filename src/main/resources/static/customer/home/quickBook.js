const schedule = {
    "CINPENUT QUỐC THANH": {
        "ÂM DƯƠNG LỘ (T16)": {
            "21/03/2025": ["08:00 AM", "02:00 PM"],
            "22/03/2025": ["10:00 AM", "06:00 PM"]
        },
        "NHÀ GA MA CHÓ (T18)": {
            "21/03/2025": ["10:00 AM", "04:00 PM"],
            "23/03/2025": ["01:00 PM", "07:00 PM"]
        },
        "NGHI LỄ TRỤC QUỶ (T18)": {
            "22/03/2025": ["09:00 AM", "03:30 PM"]
        }
    },
    "CINPENUT": {
        "NÀNG BẠCH TUYẾT (LT)": {
            "21/03/2025": ["09:00 AM", "03:00 PM", "07:00 PM"]
        },
        "SÁT THỦ VÔ CÙNG CỰC HÀI (T16)": {
            "22/03/2025": ["11:00 AM", "05:00 PM"]
        }
    },
    "Cinestar Huế": {
        "NGHỀ SIÊU KHÓ NÓI (T18)": {
            "21/03/2025": ["10:00 AM", "02:00 PM"],
            "22/03/2025": ["12:00 PM", "08:00 PM"]
        }
    }
};

function populateDropdown(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '<option selected disabled>Chọn...</option>'; // Reset dropdown
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
    select.disabled = options.length === 0;
}

function updateMovies() {
    const cinema = document.getElementById("cinemaSelect").value;
    if (schedule[cinema]) {
        populateDropdown("movieSelect", Object.keys(schedule[cinema]));
        document.getElementById("movieSelect").disabled = false;
    }
    
    // Reset dropdown tiếp theo
    populateDropdown("dateSelect", []);
    populateDropdown("timeSelect", []);
    
    document.getElementById("dateSelect").disabled = true;
    document.getElementById("timeSelect").disabled = true;
    
    checkBookingStatus();
}

function updateDates() {
    const cinema = document.getElementById("cinemaSelect").value;
    const movie = document.getElementById("movieSelect").value;
    if (schedule[cinema] && schedule[cinema][movie]) {
        populateDropdown("dateSelect", Object.keys(schedule[cinema][movie]));
        document.getElementById("dateSelect").disabled = false;
    }

    // Reset dropdown tiếp theo
    populateDropdown("timeSelect", []);
    document.getElementById("timeSelect").disabled = true;

    checkBookingStatus();
}

function updateTimes() {
    const cinema = document.getElementById("cinemaSelect").value;
    const movie = document.getElementById("movieSelect").value;
    const date = document.getElementById("dateSelect").value;
    if (schedule[cinema] && schedule[cinema][movie] && schedule[cinema][movie][date]) {
        populateDropdown("timeSelect", schedule[cinema][movie][date]);
        document.getElementById("timeSelect").disabled = false;
    }

    checkBookingStatus();
}

function checkBookingStatus() {
    const cinema = document.getElementById("cinemaSelect").value;
    const movie = document.getElementById("movieSelect").value;
    const date = document.getElementById("dateSelect").value;
    const time = document.getElementById("timeSelect").value;
    const bookButton = document.getElementById("quickBookBnt");

    console.log(`Check: Cinema: ${cinema}, Movie: ${movie}, Date: ${date}, Time: ${time}`);

    if (cinema && movie && date && time && time !== "Chọn...") {
        bookButton.disabled = false;
    } else {
        bookButton.disabled = true;
    }
}

// Thêm sự kiện cho "timeSelect" để kích hoạt checkBookingStatus khi chọn suất chiếu
document.getElementById("timeSelect").addEventListener("change", checkBookingStatus);

function initializeCinemas() {
    populateDropdown("cinemaSelect", Object.keys(schedule));
}

// Gọi hàm khi trang tải
window.addEventListener("load", initializeCinemas);
