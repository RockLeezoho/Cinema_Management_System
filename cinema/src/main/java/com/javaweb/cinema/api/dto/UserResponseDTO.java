package com.javaweb.cinema.api.dto;

import com.javaweb.cinema.persistence.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long userId;
    private String image;
    private String name;
    private LocalDate dateOfBirth;
    private String phone;
    private String email;
    private String personalId;
    private String username;
    private String password;
    private String accountStatus;
    private String position;
    private String role;
    private Long cinemaId;

    public UserResponseDTO(@NotNull User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.dateOfBirth = user.getDateOfBirth();
        this.phone = user.getPhone();
        this.personalId = user.getPersonalId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.accountStatus = user.getAccountStatus();
        this.position = user.getPosition();
        this.role = user.getRole();
        this.image = user.getImage();
        this.cinemaId = user.getCinema() != null ? user.getCinema().getCinemaId() : null;
    }

}
