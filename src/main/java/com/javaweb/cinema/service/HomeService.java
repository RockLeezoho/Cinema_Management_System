package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.HomeResponseDTO;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.persistence.entity.Voucher;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.MovieRepository;
import com.javaweb.cinema.persistence.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HomeService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public HomeResponseDTO getHomePageData() {
        HomeResponseDTO response = new HomeResponseDTO();

        // Top 3 phim có lượt xem cao nhất
        List<Movie> topMovies = movieRepository.findTop3ByOrderByViewerDesc();
        response.setTopViewedMovies(mapperRepository.movieToMovieDTOs(topMovies));

        // Lấy danh sách movieId của top 3 phim để loại trừ khi lấy phim đang chiếu
        List<Long> excludeIds = topMovies.stream()
                .map(Movie::getMovieId)
                .collect(Collectors.toList());

        // 12 phim đang chiếu theo lượt xem giảm dần, không bao gồm 3 phim top trên
        List<Movie> nowShowing = movieRepository.findTop12ByMovieStatusAndMovieIdNotInOrderByViewerDesc("NOW_SHOWING", excludeIds);
        response.setNowShowingMovies(mapperRepository.movieToMovieDTOs(nowShowing));

        // 12 phim sắp chiếu theo thứ tự trong CSDL
        List<Movie> comingSoon = movieRepository.findTop12ByMovieStatusOrderByMovieIdAsc("COMING_SOON");
        response.setComingSoonMovies(mapperRepository.movieToMovieDTOs(comingSoon));

        // 6 khuyến mãi theo CSDL
        List<Voucher> vouchers = voucherRepository.findTop6ByOrderByVoucherIdAsc();
        response.setVouchers(mapperRepository.voucherToVoucherDTOs(vouchers));

        return response;
    }

}
