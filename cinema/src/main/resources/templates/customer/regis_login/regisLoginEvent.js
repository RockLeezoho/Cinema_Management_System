function showLogin() {
    // document.getElementById('form-title').innerText = 'Đăng nhập';
    document.getElementById('submit-btn').innerText = 'Đăng nhập';
    document.getElementById('login-form').classList.remove('d-none');
    document.getElementById('register-form').classList.add('d-none');
    document.getElementById('login-btn').classList.add('active');
    document.getElementById('register-btn').classList.remove('active');
}

function showRegister() {
    // document.getElementById('form-title').innerText = 'Đăng ký';
    document.getElementById('submit-btn').innerText = 'Đăng ký';
    document.getElementById('login-form').classList.add('d-none');
    document.getElementById('register-form').classList.remove('d-none');
    document.getElementById('register-btn').classList.add('active');
    document.getElementById('login-btn').classList.remove('active');
}

document.getElementById('login-btn').addEventListener('click', showLogin);
document.getElementById('register-btn').addEventListener('click', showRegister);
document.getElementById('switch-to-login').addEventListener('click', function(event) {
    event.preventDefault();
    showLogin();
});