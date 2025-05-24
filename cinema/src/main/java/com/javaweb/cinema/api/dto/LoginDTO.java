package com.javaweb.cinema.api.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String loginIdentifier;
    private String password;
    private String expectedRole;
}
