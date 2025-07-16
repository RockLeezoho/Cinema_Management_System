package com.javaweb.cinema.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeResponseDTO {

    private List<MovieDTO> topViewedMovies;
    private List<MovieDTO> nowShowingMovies;
    private List<MovieDTO> comingSoonMovies;
    private List<VoucherDTO> vouchers;
}
