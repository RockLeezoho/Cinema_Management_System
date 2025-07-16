document.addEventListener("DOMContentLoaded", () => {
const token = localStorage.getItem("jwtToken");
    if (!token) {
        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "<h2>404 Not Found</h2>";
        return;
    }

    fetch("http://localhost:8080/admin/verify", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    .then(res => {
      if (!res.ok) throw new Error();

      const isPage = document.querySelector('meta[name="page-id"]')?.content;
      switch (isPage) {
        case "cinema":
           try {
                renderProtectedCinemaPage();
              } catch (e) {
                console.error("Lỗi khi render:", e);
           }
            break;
        case "room":
           try {
                renderProtectedRoomPage();
              } catch (e) {
                console.error("Lỗi khi render:", e);
           }
            break;
        case "seat":
           try {
                renderProtectedSeatPage();
              } catch (e) {
                console.error("Lỗi khi render:", e);
           }
            break;
        default:
              console.warn("Không xác định được trang!");
              break;
      }
    })
    .catch(() => {
      alert("Bạn không có quyền!");
      window.location.href = "/admin/register/login.html";
    });
});