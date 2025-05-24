function searchMovies() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#moviesAll tbody tr");

    rows.forEach(row => {
        const title = row.cells[2].textContent.toLowerCase(); 
        const genre = row.cells[3].textContent.toLowerCase(); 

        row.style.display = (title.includes(keyword) || genre.includes(keyword)) ? "" : "none";
    });
}


// document.getElementById("searchButton").addEventListener("click", searchMovies);
