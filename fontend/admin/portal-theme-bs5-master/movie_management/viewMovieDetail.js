function setMovieIndex(button, e) {
    let row = button.closest("tr");
    let index = Array.from(row.parentNode.children).indexOf(row);
    document.getElementById("movieDetailModal").setAttribute("data-index", index);

    e === 1 ? openMovieDetail(index) : deleteMovie(index);
};

function openMovieDetail(index) {
    let modal = document.getElementById("movieDetailModal");
    var movieDetailModal = new bootstrap.Modal(modal);
    movieDetailModal.show();

    const uploadBtn = document.getElementById("uploadDetailBtn");
    const fileInput = document.getElementById("detailMoviePoster");
    const posterPreview = document.getElementById("detailPosterPreview");

    uploadBtn.onclick = function () {
        fileInput.value = ""; // Đảm bảo onchange luôn kích hoạt
        fileInput.click();
    };

    fileInput.onchange = function (event) {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
            if (!allowedTypes.includes(file.type)) {
                alert("Định dạng file không hợp lệ! Chỉ chấp nhận PNG, JPG, JPEG.");
                fileInput.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.");
                fileInput.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                posterPreview.src = e.target.result;
                console.log("Ảnh xem trước đã cập nhật.");
            };
            reader.readAsDataURL(file);
        }
    };

    fetch("movieList.json")
        .then(response => response.json())
        .then(data => {
            const movie = data.movies[index];
            document.getElementById("detailPosterPreview").src = movie.poster;
            document.getElementById("detailMovieTitle").value = movie.title;
            document.getElementById("detailMovieGenre").value = movie.genre;
            document.getElementById("detailMovieDirector").value = movie.director;
            document.getElementById("detailMovieActors").value = movie.actors;
            document.getElementById("detailMovieYear").value = movie.year;
            document.getElementById("detailMovieDuration").value = movie.duration;
            document.getElementById("detailMovieCountry").value = movie.country;
            document.getElementById("detailMovieAge").value = movie.age_rating;
            document.getElementById("detailMovieStatus").value = movie.status;
            document.getElementById("detailMovieView").value = movie.views;
            document.getElementById("detailMovieDescription").value = movie.description;

            const updateBtn = document.getElementById("updateMovieBtn");
            updateBtn.onclick = function () {
                updateMovie(index);
            };
        })
        .catch(error => console.error("Lỗi khi đọc JSON:", error));
}

function updateMovie(index) {
    fetch("movieList.json")
        .then(response => response.json())
        .then(data => {
            let movie = data.movies[index];
            movie.poster = document.getElementById("detailPosterPreview").src;
            movie.title = document.getElementById("detailMovieTitle").value;
            movie.genre = document.getElementById("detailMovieGenre").value;
            movie.director = document.getElementById("detailMovieDirector").value;
            movie.actors = document.getElementById("detailMovieActors").value;
            movie.year = document.getElementById("detailMovieYear").value;
            movie.duration = document.getElementById("detailMovieDuration").value;
            movie.country = document.getElementById("detailMovieCountry").value;
            movie.age_rating = document.getElementById("detailMovieAge").value;
            movie.status = document.getElementById("detailMovieStatus").value;
            movie.views = document.getElementById("detailMovieView").value;
            movie.description = document.getElementById("detailMovieDescription").value;

            console.log("Dữ liệu cập nhật:", movie);
            alert("Phim đã được cập nhật!");
        })
        .catch(error => console.error("Lỗi khi cập nhật:", error));
}

function deleteMovie(index) {
    fetch("movieList.json")
        .then(response => response.json())
        .then(data => {
            let moviesArray = data.movies;
            if (!Array.isArray(moviesArray)) {
                console.error("Lỗi: movies không phải là một mảng!");
                return;
            }

            if (isNaN(index) || index < 0 || index >= moviesArray.length) {
                console.error("Lỗi: Index không hợp lệ!");
                return;
            }

            let confirmDelete = confirm(`Bạn có chắc chắn muốn xóa phim: "${moviesArray[index].title}" không?`);
            
            if (confirmDelete) {
                moviesArray.splice(index, 1);
                console.log("Danh sách phim sau khi xóa:", moviesArray);
                updateMovieList();
            }
        })
        .catch(error => console.error("Lỗi khi tải file JSON:", error));
}

function updateMovieList() {
    console.log("Danh sách phim được cập nhật lại trên giao diện.");
}
