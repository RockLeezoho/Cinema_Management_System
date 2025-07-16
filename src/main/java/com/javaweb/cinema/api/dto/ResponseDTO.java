package com.javaweb.cinema.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseDTO {
    private UserDTO userDTO;
    private String token;
}
