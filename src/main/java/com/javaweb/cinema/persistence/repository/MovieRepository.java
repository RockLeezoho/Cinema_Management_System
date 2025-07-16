package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.persistence.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findTop3ByOrderByViewerDesc();
    List<Movie> findTop12ByMovieStatusOrderByViewerDesc(String movieStatus);
    List<Movie> findTop12ByMovieStatusOrderByMovieIdAsc(String status);
    List<Movie> findByMovieStatus(String status);

    List<Movie> findByTitleContainingIgnoreCase(String keyword);
    List<Movie> findTop12ByMovieStatusAndMovieIdNotInOrderByViewerDesc(String movieStatus, List<Long> excludeIds);

}
