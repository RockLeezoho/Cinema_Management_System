// Mở modal xem chi tiết phim
function openMovieDetail(movieRow) {
    const cells = movieRow.getElementsByTagName("td");

    document.getElementById("detailMovieTitle").value = cells[2].textContent;
    document.getElementById("detailMovieGenre").value = cells[3].textContent;
    document.getElementById("detailMovieYear").value = cells[4].textContent;
    document.getElementById("detailMovieDuration").value = cells[5].textContent;
    document.getElementById("detailPosterPreview").src = cells[1].querySelector("img").src;

    var movieDetailModal = new bootstrap.Modal(document.getElementById("movieDetailModal"));
    movieDetailModal.show();

    document.getElementById("detailMoviePoster").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
            if (!allowedTypes.includes(file.type)) {
                alert("Chỉ chấp nhận PNG, JPG, JPEG.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("File phải nhỏ hơn 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("detailPosterPreview").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById("updateMovieBtn").onclick = function() {
        cells[2].textContent = document.getElementById("detailMovieTitle").value;
        cells[3].textContent = document.getElementById("detailMovieGenre").value;
        cells[4].textContent = document.getElementById("detailMovieYear").value;
        cells[5].textContent = document.getElementById("detailMovieDuration").value;
        cells[1].querySelector("img").src = document.getElementById("detailPosterPreview").src;

        movieDetailModal.hide();
    };
}
