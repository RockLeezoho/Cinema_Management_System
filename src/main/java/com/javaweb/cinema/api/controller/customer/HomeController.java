package com.javaweb.cinema.api.controller.customer;

import com.javaweb.cinema.api.dto.ConcessionDTO;
import com.javaweb.cinema.api.dto.HomeResponseDTO;
import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.api.dto.VoucherDTO;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.MovieRepository;
import com.javaweb.cinema.service.ConcessionService;
import com.javaweb.cinema.service.HomeService;
import com.javaweb.cinema.service.MovieService;
import com.javaweb.cinema.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cinpenut")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MapperRepository mapperRepository;

    @Autowired
    private MovieService movieService;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private ConcessionService concessionService;

    @GetMapping("/home")
    public HomeResponseDTO getHomeData() {
        return homeService.getHomePageData();
    }

    @GetMapping("/movies")
    public ResponseEntity<List<MovieDTO>> getMoviesByStatus(@RequestParam("status") String status) {
        List<MovieDTO> movieDTOs = movieService.getMoviesByStatus(status);
        return ResponseEntity.ok(movieDTOs);
    }

    @GetMapping("/vouchers")
    public ResponseEntity<List<VoucherDTO>> getAllVouchers() {
        List<VoucherDTO> voucherDTOs = voucherService.getAllVouchers();
        return ResponseEntity.ok(voucherDTOs);
    }

    @GetMapping("/concessions")
    public ResponseEntity<List<ConcessionDTO>> getAllConcessions() {
        List<ConcessionDTO> concessionDTOS = concessionService.getAllConcessions();
        return ResponseEntity.ok(concessionDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MovieDTO>> searchMovies(@RequestParam("keyword") String keyword) {
        List<MovieDTO> movieDTOs = movieService.searchMoviesByTitle(keyword);
        return ResponseEntity.ok(movieDTOs);
    }
}

