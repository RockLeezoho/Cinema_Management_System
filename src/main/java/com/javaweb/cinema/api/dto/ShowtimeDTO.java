package com.javaweb.cinema.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowtimeDTO {

    private Long showtimeId;
    private String startTime;
    private String endTime;
    private String showDate;
    private Long movieId;
    private Long roomId;
}
