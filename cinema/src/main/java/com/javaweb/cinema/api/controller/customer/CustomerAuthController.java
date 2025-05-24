package com.javaweb.cinema.api.controller.customer;

import com.javaweb.cinema.api.dto.LoginDTO;
import com.javaweb.cinema.api.dto.ResponseDTO;
import com.javaweb.cinema.api.dto.UserDTO;
import com.javaweb.cinema.service.CustomUserDetailsService;
import com.javaweb.cinema.service.JwtService;
import com.javaweb.cinema.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping("/cinpenut")
public class CustomerAuthController {

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
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginDTO.getLoginIdentifier());

            // wrap username and password into UsernamePasswordAuthenticationToken
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDetails.getUsername(), loginDTO.getPassword()));

            //check role
            if (!userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_" + loginDTO.getExpectedRole()))) {
                log.warn("Unauthorized role access attempt by user: {}", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Tên đăng nhập hoặc mật khẩu không đúng.");
            }

            String jwt = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(jwt);

        } catch (UsernameNotFoundException | BadCredentialsException e) {
            log.warn("Login failed for [{}]: {}", loginDTO.getLoginIdentifier(), e.getMessage()); //Ghi log noi boi (ghi ro nguyen nhan)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Tên đăng nhập hoặc mật khẩu không đúng.");
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }
    }

    @PostMapping("/signUp")
    public ResponseEntity<?> addingUser(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        Map<String, List<String>> errorResponse = new HashMap<>();
        List<String> errors = new ArrayList<>();

        if(bindingResult.hasErrors()) {
            errorResponse.put("errors", bindingResult
                    .getFieldErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList()));

            return ResponseEntity
                    .badRequest()
                    .body(errorResponse);
        }

        if (userService.checkPhoneExists(userDTO.getPhone())) {
            errors.add("Phone number already exists.");
        }
        if (userService.checkEmailExists(userDTO.getEmail())) {
            errors.add("Email already exists.");
        }
        if (userService.checkUsernameExists(userDTO.getUsername())) {
            errors.add("Username already exists.");
        }

        if (!errors.isEmpty()) {
            errorResponse.put("errors", errors);
           return ResponseEntity.badRequest().body(errorResponse);
        }

        UserDTO createdUser = userService.addUser(userDTO);
        UserDetails userDetails = customUserDetailsService.setUserDetails(
                createdUser.getUsername(),
                createdUser.getPassword(),
                createdUser.getRole());
        String jwt = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(ResponseDTO.builder()
                .userDTO(createdUser)
                .token(jwt)
                .build());
    }
}

