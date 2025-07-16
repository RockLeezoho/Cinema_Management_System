package com.javaweb.cinema.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data //includes @Setter, @Getter,...
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    //JSON field names must be the same as variable names in DTO

    @NotBlank(message= "Invalid information. Please check again.")
    private String name;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @NotBlank(message= "Invalid information. Please check again.")
    private String phone;

    @JsonProperty(access= JsonProperty.Access.WRITE_ONLY)
    private String personalId;

    @NotBlank(message= "Invalid information. Please check again.")
    private String email;

    private String username;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$",
    message= "Password must be at least 8 characters, including uppercase, lowercase, numbers and special characters.")
    @JsonProperty(access= JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String accountStatus;

    private String position;

    @NotBlank(message= "Invalid information. Please check again.")
    private String role;

    private String image;

    private Long cinemaId;

}
