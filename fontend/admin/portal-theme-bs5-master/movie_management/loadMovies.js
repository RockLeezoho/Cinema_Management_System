document.addEventListener("DOMContentLoaded", function () {
    
    // Hàm tải dữ liệu phim từ JSON
  function loadMovies(targetTableId, filterType = "all") {
    fetch("movieList.json") // Đọc file JSON
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.querySelector(`#${targetTableId} tbody`);
        tableBody.innerHTML = ""; // Xóa dữ liệu cũ trước khi cập nhật mới

        // Lọc phim theo loại nếu có yêu cầu
        let filteredMovies = data.movies;
        if (filterType === "most-viewed") {
          filteredMovies = filteredMovies.sort((a, b) => b.views - a.views); // Sắp xếp giảm dần theo lượt xem
        }

        // Chèn dữ liệu vào bảng
        
        
        filteredMovies.forEach((movie, index) => {
            let modal = document.getElementById("movieDetailModal");
            modal.setAttribute("data-index", index);
            const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td><img src="${movie.poster}" width="50"></td>
                            <td>${movie.title}</td>
                            <td>${movie.genre}</td>
                            <td>${movie.age_rating}</td>
                            <td>${movie.country}</td>
                            <td>${movie.views}</td>
                            <td>${movie.status}</td>
                            <td class="cell">
                                <button type="button" class="btn app-btn-secondary" style="font-size:13px;width:76px;height:25px;padding:0;" data-bs-target= "#movieDetailModal" onclick="setMovieIndex(this, 1)">Xem chi tiết</button>
                            </td>
                    
                            <td class="cell">
                                <button type="button" class="btn app-btn-secondary" style="font-size:13px;width:76px;height:25px;padding:0;" data-bs-target="#movieDetailModal" onclick="setMovieIndex(this, 0)">Xóa</button>
                            </td>
                        </tr>
                        
                                  `;
          tableBody.innerHTML += row;
        });
      })
      .catch((error) => console.error("Lỗi khi tải phim:", error));
  }


  // Gọi dữ liệu cho tab đầu tiên khi trang tải
  loadMovies("moviesAll", "all");

  // Thêm sự kiện khi chuyển tab
  document.querySelectorAll('a[data-bs-toggle="tab"]').forEach((tab) => {
    tab.addEventListener("shown.bs.tab", function (event) {
      const targetTabId = event.target.getAttribute("href").substring(1); // Lấy ID của tab
      if (targetTabId === "orders-all") {
        loadMovies("moviesAll", "all");
      } else if (targetTabId === "orders-pending") {
        loadMovies("moviesView", "most-viewed");
      }
    });
  });
});
