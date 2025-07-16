//const bannerImages = [
//    { src: "../../../../../../images/anh_khong_dau.jpg", alt: "Anh_Khong_Dau", class: "slide__banner1" },
//    { src: "../../../../../../images/dark_nuns.png", alt: "Dark_Nuns", class: "slide__banner2" }
//];
//
//const movieLists_showing = [
//    { title: "GIAO HÀNG CHO MA (T16)", format: "2D", ageLimit: "T16", views: 1200, trailer: "#", ticket: "#", img: "../images/giao_hang_cho_ma.png"},
//    { title: "BƯỚC CHÂN DŨNG CẢM (T18)", format: "3D", ageLimit: "T18", views: 800, trailer: "#", ticket: "#", img: "../images/Buoc_chan_dung_cam.png"},
//    { title: "CUỘC ĐÀO TẨU TRÊN KHÔNG (T13)", format: "HD", ageLimit: "T13", views: 1500, trailer: "#", ticket: "#", img: "../images/Cuoc_dao_tau_tren_khong.png"},
//    { title: "NGƯỜI SÓI (T18)", format: "2D", ageLimit: "T18", views: 950, trailer: "#", ticket: "#", img: "../images/Nguoi_soi.png"},
//    { title: "NHÀ GIA TIÊN (T16)", format: "3D", ageLimit: "T16", views: 900, trailer: "#", ticket: "#", img: "../images/nha_gia_tien.webp"},
//    { title: "NỤ HÔN BẠC TỶ (T18)", format: "HD", ageLimit: "T18", views: 650, trailer: "#", ticket: "#", img: "../images/Nu_hon_bac_ty.png"},
//    { title: "NỮ TU BÓNG TỐI (T18)", format: "3D", ageLimit: "T18", views: 1100, trailer: "#", ticket: "#", img: "../images/nu_tu_bong_toi.png"},
//    { title: "NHÀ GA MA CHÓ (T18)", format: "3D", ageLimit: "T18", views: 1700, trailer: "#", ticket: "#", img: "../images/Nha_ga_ma_cho.png"}
//];
//
//const movieLists_coming = [
//    { title: "GIAO HÀNG CHO MA (T16)", format: "2D", ageLimit: "T16", premiere: "21/04/2025", trailer: "#", ticket: "#", img: "../images/giao_hang_cho_ma.png"},
//    { title: "BƯỚC CHÂN DŨNG CẢM (T18)", format: "3D", ageLimit: "T18", premiere: "13/04/2025", trailer: "#", ticket: "#", img: "../images/Buoc_chan_dung_cam.png"},
//    { title: "CUỘC ĐÀO TẨU TRÊN KHÔNG (T13)", format: "HD", ageLimit: "T13", premiere: "01/04/2025", trailer: "#", ticket: "#", img: "../images/Cuoc_dao_tau_tren_khong.png"},
//    { title: "NGƯỜI SÓI (T18)", format: "2D", ageLimit: "T18", premiere: "05/04/2025", trailer: "#", ticket: "#", img: "../images/Nguoi_soi.png"},
//    { title: "NHÀ GIA TIÊN (T16)", format: "3D", ageLimit: "T16", premiere: "28/04/2025", trailer: "#", ticket: "#", img: "../images/nha_gia_tien.png"},
//    { title: "NỤ HÔN BẠC TỶ (T18)", format: "HD", ageLimit: "T18", premiere: "15/04/2025", trailer: "#", ticket: "#", img: "../images/Nu_hon_bac_ty.png"},
//    { title: "NỮ TU BÓNG TỐI (T18)", format: "3D", ageLimit: "T18", premiere: "17/04/2025", trailer: "#", ticket: "#", img: "../images/nu_tu_bong_toi.png"},
//    { title: "NHÀ GA MA CHÓ (T18)", format: "3D", ageLimit: "T18", premiere: "20/04/2025", trailer: "#", ticket: "#", img: "../images/Nha_ga_ma_cho.png"}
//];
//
//const movieLists_voucher = [
//    { title: "GIẢM GIÁ CHO HỌC SINH/SINH VIÊN", img: "../images/Km_hoc_sinh.png"},
//    { title: "ĐỒNG GIÁ", img: "../images/Km_dong_gia.png"},
//    { title: "GIẢM GIÁ CHO HỌC SINH/SINH VIÊN", img: "../images/Km_hoc_sinh.png"},
//    { title: "ĐỒNG GIÁ", img: "../images/Km_dong_gia.png"},
//    { title: "GIẢM GIÁ CHO HỌC SINH/SINH VIÊN", img: "../images/Km_hoc_sinh.png"},
//    { title: "ĐỒNG GIÁ", img: "../images/Km_dong_gia.png"},
//];
//
//
//
//const moviesPerSlide = 4;
//const totalSlides = Math.ceil(movieLists_coming.length / moviesPerSlide);
//let currentIndexes = {
//    showing: 0,
//    coming: 0,
//    voucher: 0
//};
//
//function loadMovies(sec_sl) {
//    const sliders = document.getElementById(sec_sl + "Slider");
//    let movieLists = ``;
//    if(sec_sl === `voucher`){
//        movieLists = movieLists_voucher;
//    }else{
//        movieLists = (sec_sl === `showing` ? movieLists_showing : movieLists_coming);
//    }
//
//    movieLists.forEach(movie => {
//        let movieHTML = ``;
//        if(sec_sl === `voucher`){
//            movieHTML = `
//                <div class="slide voucher__slide">
//                    <img src="${movie.img}" class="voucher__item">
//                </div>
//            `;
//        }else{
//            movieHTML += (sec_sl === `showing` ?
//        `
//            <div class="slide showing__slide">
//                <div class="slide-top-info">${movie.format} | ${movie.ageLimit}</div>
//                <img src="${movie.img}" alt="${movie.title}" class="movie__item">
//                <div class="slide-content">
//                    <h5>${movie.title}</h5>
//                    <p>Lượt xem: ${movie.views}</p>
//                    <div class="btn-container">
//                        <a href="${movie.trailer}"><img src="../icons/play-vid.png">Xem Trailer</a>
//                        <a href="../book_tickets/bookTickets.html"class="btn btn-book">ĐẶT VÉ</a>
//                    </div>
//                </div>
//            </div>
//        ` :
//        `
//            <div class="slide coming__slide">
//                <div class="slide-top-info">${movie.format} | ${movie.ageLimit}</div>
//                <img src="${movie.img}" alt="${movie.title}" class="movie__item">
//                <div class="slide-content">
//                    <h5>${movie.title}</h5>
//                    <p>Khởi chiếu: ${movie.premiere}</p>
//                    <div class="btn-container">
//                        <a href="${movie.trailer}"><img src="../icons/play-vid.png">Xem Trailer</a>
//                        <a href="#"class="btn btn-book">TÌM HIỂU THÊM</a>
//                    </div>
//                </div>
//            </div>
//        `
//    )}
//    sliders.innerHTML += movieHTML;
//});
//    updateButtons(sec_sl);
//}
//
//function updateButtons(sec_sl) {
//    document.getElementById(sec_sl + "prevBtn").disabled = currentIndexes[sec_sl] === 0;
//    let movieLists = ``;
//    if(sec_sl === `voucher`){
//        movieLists = movieLists_voucher;
//    }else{
//        movieLists = (sec_sl === `showing` ? movieLists_showing : movieLists_coming);
//    }
//    document.getElementById(sec_sl + "nextBtn").disabled = currentIndexes[sec_sl] >= movieLists.length - moviesPerSlide;
//
//    // Cap nhat indicators
//    let indicators = document.querySelectorAll(`#${sec_sl}Indicators button`);
//    indicators.forEach((btn, index) => {
//        btn.classList.toggle("active", index === Math.floor(currentIndexes[sec_sl] / moviesPerSlide));
//    });
//}
//
//
//function nextSlide(sec_sl) {
//    let movieLists = ``;
//    if(sec_sl === `voucher`){
//        movieLists = movieLists_voucher;
//    }else{
//        movieLists = (sec_sl === `showing` ? movieLists_showing : movieLists_coming);
//    }
//    if(currentIndexes[sec_sl] < movieLists.length - moviesPerSlide) {
//        currentIndexes[sec_sl] += moviesPerSlide;
//        document.getElementById(sec_sl + "Slider").style.transform = `translateX(-${currentIndexes[sec_sl] * 25}%)`;
//        updateButtons(sec_sl);
//    }
//}
//
//function prevSlide(sec_sl){
//    if(currentIndexes[sec_sl] > 0){
//        currentIndexes[sec_sl] -= moviesPerSlide;
//        document.getElementById( sec_sl + "Slider").style.transform = `translateX(-${currentIndexes[sec_sl] * 25}%)`;
//        updateButtons(sec_sl);
//    }
//}
//
//function goToSlide(index, sec_sl){
//    currentIndexes[sec_sl] = index * moviesPerSlide;
//    document.getElementById(sec_sl + "Slider").style.transform = `translateX(-${(currentIndexes[sec_sl] / moviesPerSlide) * 100}%)`;
//    updateButtons(sec_sl);
//}
//
//
//window.onload = () => {
//    loadMovies("showing");
//    loadMovies("coming");
//    loadMovies("voucher");
//};

let movieLists_showing = ``;
let movieLists_coming = ``;
let movieLists_voucher = ``;

const moviesPerSlide = 4;
const totalSlides = Math.ceil(movieLists_coming.length / moviesPerSlide);
let currentIndexes = {
    showing: 0,
    coming: 0,
    voucher: 0
};


function loadMovies(sec_sl) {
    const sliders = document.getElementById(sec_sl + "Slider");
   let movieLists = ``;
    if(sec_sl === `voucher`){
        movieLists = movieLists_voucher;
    }else{
        movieLists = (sec_sl === `showing` ? movieLists_showing : movieLists_coming);
    }

    movieLists.forEach(movie => {
        let movieHTML = ``;
        if(sec_sl === `voucher`){
            movieHTML = `
                <div class="slide voucher__slide">
                    <img src="${movie.image}" class="voucher__item">
                </div>
            `;
        }else{
            movieHTML += (sec_sl === `showing` ?
        `
            <div class="slide showing__slide">
                <div class="slide-top-info">${movie.format} | T${movie.ageRating}</div>
                <img src="${movie.image}" alt="${movie.title}" class="movie__item">
                <div class="slide-content">
                    <h5>${movie.title}</h5>
                    <p>Lượt xem: ${movie.viewer}</p>
                    <div class="btn-container">
                        <a href="${movie.trailer}"><img src="/customer/icons/play-vid.png">Xem Trailer</a>
                        <a href="#" class="btn btn-book booking-ticket" movie-id="${movie.movieId}">ĐẶT VÉ</a>
                    </div>
                </div>
            </div>
        ` :
        `
            <div class="slide coming__slide">
                <div class="slide-top-info">${movie.format} | ${movie.ageRating}</div>
                <img src="${movie.image}" alt="${movie.title}" class="movie__item">
                <div class="slide-content">
                    <h5>${movie.title}</h5>
                    <p>Khởi chiếu: ${movie.premiere}</p>
                    <div class="btn-container">
                        <a href="${movie.trailer}"><img src="/customer/icons/play-vid.png">Xem Trailer</a>
                        <a href="#" class="btn btn-book" movie-id="${movie.id}">TÌM HIỂU THÊM</a>
                    </div>
                </div>
            </div>
        `
    )}
    sliders.innerHTML += movieHTML;
});
    updateButtons(sec_sl);
}

function updateButtons(sec_sl) {
    document.getElementById(sec_sl + "prevBtn").disabled = currentIndexes[sec_sl] === 0;
    let movieLists = ``;
    if(sec_sl === `voucher`){
        movieLists = movieLists_voucher;
    }else{
        movieLists = (sec_sl === `showing` ? movieLists_showing : movieLists_coming);
    }
    document.getElementById(sec_sl + "nextBtn").disabled = currentIndexes[sec_sl] >= movieLists.length - moviesPerSlide;

    // Cap nhat indicators
    let indicators = document.querySelectorAll(`#${sec_sl}Indicators button`);
    indicators.forEach((btn, index) => {
        btn.classList.toggle("active", index === Math.floor(currentIndexes[sec_sl] / moviesPerSlide));
    });
}

function nextSlide(sec_sl) {
    let movieLists = ``;
    if(sec_sl === `voucher`){
        movieLists = movieLists_voucher;
    }else{
        movieLists = (sec_sl === `showing` ? movieLists_showing : movieLists_coming);
    }
    if(currentIndexes[sec_sl] < movieLists.length - moviesPerSlide) {
        currentIndexes[sec_sl] += moviesPerSlide;
        document.getElementById(sec_sl + "Slider").style.transform = `translateX(-${currentIndexes[sec_sl] * 25}%)`;
        updateButtons(sec_sl);
    }
}

function prevSlide(sec_sl){
    if(currentIndexes[sec_sl] > 0){
        currentIndexes[sec_sl] -= moviesPerSlide;
        document.getElementById( sec_sl + "Slider").style.transform = `translateX(-${currentIndexes[sec_sl] * 25}%)`;
        updateButtons(sec_sl);
    }
}

function goToSlide(index, sec_sl){
    currentIndexes[sec_sl] = index * moviesPerSlide;
    document.getElementById(sec_sl + "Slider").style.transform = `translateX(-${(currentIndexes[sec_sl] / moviesPerSlide) * 100}%)`;
    updateButtons(sec_sl);
}


function loadBanners(banners) {
    const bannerContainer = document.getElementById("carouselInner");
    bannerContainer.innerHTML = "";

    banners.forEach((banner, index) => {
        const div = document.createElement("div");
        div.className = "carousel-item" + (index === 0 ? " active" : "");

        const img = document.createElement("img");
        img.src = banner.image;
        img.alt = banner.title || "Banner";
        img.className = "d-block w-100";

        div.appendChild(img);
        bannerContainer.appendChild(div);
    });
}


// Hàm gọi API và khởi tạo trang
async function fetchDataAndRender() {
    try {
        const response = await fetch('http://localhost:8080/cinpenut/home');
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu API");
        const data = await response.json();

        banners = data.topViewedMovies;
        movieLists_showing = data.nowShowingMovies;
        movieLists_coming = data.comingSoonMovies;
        movieLists_voucher = data.vouchers

        loadBanners(banners);
        loadMovies("showing");
        loadMovies("coming");
        loadMovies("voucher");

    } catch (error) {
        console.error(error);
    }
}

//Xu ly nut dat ve
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
    const target = event.target;

    if (target.matches('.btn-book')) {
      event.preventDefault();

      const movieId = target.getAttribute('movie-id');
      console.log("Bạn đã bấm nút đặt vé cho phim:", movieId);

      if (!movieId) {
        alert('Không có ID phim!');
        return;
      }

      fetch(`http://localhost:8080/cinpenut/booking/movies/${movieId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Phim không tồn tại hoặc lỗi server');
          }
          return response.json();
        })
        .then(data => {
          console.log("Thông tin phim nhận được:", data); // <-- Xem kết quả

          sessionStorage.setItem('selectedMovie', JSON.stringify(data));
          window.location.href = '/customer/book_tickets/bookTickets.html'; // <-- Đổi nếu cần
        })
        .catch(error => {
          console.error('Lỗi khi lấy thông tin phim:', error);
          alert('Đã xảy ra lỗi khi lấy thông tin phim');
        });
    }
  });
});


window.addEventListener('load', function () {
  fetchDataAndRender();
});

