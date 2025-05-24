package com.javaweb.cinema.api.controller.admin;

import com.javaweb.cinema.api.dto.LoginDTO;
import com.javaweb.cinema.service.CustomUserDetailsService;
import com.javaweb.cinema.service.JwtService;
import com.javaweb.cinema.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/_adminv1-cinpenut")
public class AdminAuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/login/")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDTO){
        try {
            //wrap username and password into UsernamePasswordAuthenticationToken
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getLoginIdentifier(), loginDTO.getPassword()));

            //get user infor
            UserDetails userDetails = (UserDetails)authentication.getPrincipal();

            //check role
            if (!userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_" + loginDTO.getExpectedRole()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No access allowed!");
            }

            String jwt = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(jwt);

        } catch (UsernameNotFoundException | BadCredentialsException e) {
            log.warn("Login failed for [{}]: {}", loginDTO.getLoginIdentifier(), e.getMessage()); //Ghi log noi boi (ghi ro nguyen nhan)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Tên đăng nhập hoặc mật khẩu không đúng!");
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đăng nhập thất bại. Vui lòng thử lại sau!");
        }
    }
}
