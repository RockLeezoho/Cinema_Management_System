package com.javaweb.cinema.service;

import com.javaweb.cinema.dto.LoginRequest;
import com.javaweb.cinema.dto.LoginResponse;
import com.javaweb.cinema.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .map(user -> {
                    if (user.getPassword().equals(request.getPassword())) {
                        return new LoginResponse(true, "Đăng nhập thành công");
                    } else {
                        return new LoginResponse(false, "Sai mật khẩu");
                    }
                })
                .orElse(new LoginResponse(false, "Tài khoản không tồn tại"));
    }
}
