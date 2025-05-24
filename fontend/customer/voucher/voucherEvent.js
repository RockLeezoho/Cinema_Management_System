document.addEventListener("DOMContentLoaded", function () {
    fetch("data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Không thể tải data.json");
        }
        return response.json();
    })
    .then(data__voucher => {
        Object.keys(data__voucher).forEach(title => {
            let voucher = data__voucher[title]; // Lấy đối tượng voucher thực sự

            document.getElementById("poster__voucher").innerHTML = `
                <img src="${voucher.poster}" alt="${title}">
            `;
            document.getElementById("header__form").innerHTML = `
                <h3 class="title__poster">${title}</h3>
            `;
            document.getElementById("condition__title").innerHTML = `
                <h4 class="title__condition">Điều kiện</h4>
            `;
            document.getElementById("condition__details").innerHTML = `
                <li class="item">${voucher.condition}</li>
            `;
            document.getElementById("notice__title").innerHTML = `
                <h4 class="title__notice">Lưu ý</h4>
            `;
            document.getElementById("notice__details").innerHTML = `
                <li class="item">${voucher.notice}</li>
            `;
        });
    })
    .catch(error => console.error("Lỗi tải dữ liệu:", error));
});
