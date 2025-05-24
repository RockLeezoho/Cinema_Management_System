package com.javaweb.cinema.api.dto;

import lombok.Data;

@Data
public class ShowtimeDTO {

    private Long id;
    private String startTime;
    private String endTime;
    private String showDate;
    private Long movieId;
    private Long roomId;
}
