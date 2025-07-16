document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("signin-username");
    const passwordInput = document.getElementById("signin-password");
    const rememberCheckbox = document.getElementById("RememberPassword");

    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");

    // Gợi ý lại username và mật khẩu nếu đã ghi nhớ
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;

        if (savedPassword) {
            passwordInput.value = savedPassword;
        }
    }

    // Khi người dùng thay đổi username, nếu khớp thì tự gán mật khẩu
    usernameInput.addEventListener("input", () => {
        const currentUsername = usernameInput.value.trim();
        if (currentUsername === savedUsername && savedPassword) {
            passwordInput.value = savedPassword;
        } else {
            passwordInput.value = "";
        }
    });

    // Sự kiện submit form
    document.querySelector(".auth-form").addEventListener("submit", async function (e) {
        e.preventDefault(); // Chặn reload

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberCheckbox.checked;

        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin đăng nhập.");
            return;
        }

        const loginData = {
            loginIdentifier: username,
            password: password,
            expectedRole: "ADMIN"
        };

        try {
            const response = await fetch("http://localhost:8080/_adminv1-cinpenut/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const token = await response.text();

                localStorage.setItem("jwtToken", token);
                sessionStorage.setItem("jwtToken", token);
                if (rememberMe) {
                    localStorage.setItem("rememberedUsername", username);
                    localStorage.setItem("rememberedPassword", password);
                } else {
                    localStorage.removeItem("rememberedUsername");
                    localStorage.removeItem("rememberedPassword");
                }

                try {
                    const base64Payload = token.split('.')[1];
                    const decodedPayload = atob(base64Payload);
                    const payload = JSON.parse(decodedPayload);
                    const roles = payload.role || [];

                    if (roles.includes("ROLE_ADMIN")) {
                        window.location.href = "../home/index.html";
                    } else {
                        alert("Tài khoản không có quyền truy cập!");
                        localStorage.removeItem("jwtToken");
                        sessionStorage.removeItem("jwtToken");
                    }
                } catch (err) {
                    console.error("Lỗi giải mã token:", err);
                    alert("Token không hợp lệ.");
                    localStorage.removeItem("jwtToken");
                    sessionStorage.removeItem("jwtToken");
                }
            } else {
                const errorText = await response.text();
                alert("Đăng nhập thất bại: " + errorText);
                localStorage.removeItem("jwtToken");
                sessionStorage.removeItem("jwtToken");
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            alert("Lỗi hệ thống. Vui lòng thử lại sau.");
        }
    });
});
