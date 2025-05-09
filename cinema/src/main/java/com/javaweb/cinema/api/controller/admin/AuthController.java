package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.dto.LoginRequest;
import com.javaweb.cinema.dto.LoginResponse;
import com.javaweb.cinema.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
