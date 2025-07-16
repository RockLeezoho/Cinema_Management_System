package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public Optional<MovieDTO> findMovieById(Long id) {
        return movieRepository.findById(id)
                .map(movie -> mapperRepository.movieToMovieDTO(movie));
    }

    public Page<MovieDTO> findMovie(Pageable pageable) {
        Page<Movie> movies = movieRepository.findAll(pageable);
        return movies.map(mapperRepository::movieToMovieDTO);
    }

    public Movie createMovie(MovieDTO movieDTO) {
        Movie movie = new Movie();

        movie.setTitle(movieDTO.getTitle());
        movie.setImage(movieDTO.getImage());
        movie.setType(movieDTO.getType());
        movie.setFormat(movieDTO.getFormat());
        movie.setPremiere(movieDTO.getPremiere());
        movie.setAgeRating(movieDTO.getAgeRating());
        movie.setCountry(movieDTO.getCountry());
        movie.setDirector(movieDTO.getDirector());
        movie.setPerformers(movieDTO.getPerformers());
        movie.setDuration(movieDTO.getDuration());
        movie.setContent(movieDTO.getContent());
        movie.setTrailer(movieDTO.getTrailer());
        movie.setViewer(movieDTO.getViewer() != null ? movieDTO.getViewer() : 0);
        movie.setMovieStatus(movieDTO.getMovieStatus() != null ? movieDTO.getMovieStatus() : "coming soon");
        return movieRepository.save(movie);
    }

    public Optional<MovieDTO> updateUser(Long id, MovieDTO movieDTO) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);
        if (optionalMovie.isEmpty()) {
            return Optional.empty();
        }

        Movie movie = optionalMovie.get();
        if (movieDTO.getImage() != null && !movieDTO.getImage().isEmpty()) {
            movie.setImage(movieDTO.getImage());
        }

        movie.setTitle(movieDTO.getTitle());
        movie.setType(movieDTO.getType());
        movie.setFormat(movieDTO.getFormat());
        movie.setPremiere(movieDTO.getPremiere());
        movie.setAgeRating(movieDTO.getAgeRating());
        movie.setCountry(movieDTO.getCountry());
        movie.setDirector(movieDTO.getDirector());
        movie.setPerformers(movieDTO.getPerformers());
        movie.setDuration(movieDTO.getDuration());
        movie.setContent(movieDTO.getContent());
        movie.setTrailer(movieDTO.getTrailer());
        movie.setViewer(movieDTO.getViewer());

        movie.setMovieStatus(
                movieDTO.getMovieStatus() != null ? movieDTO.getMovieStatus() : "COMING_SOON"
        );

        Movie saved = movieRepository.save(movie);

        MovieDTO updatedDTO = mapperRepository.movieToMovieDTO(saved);
        return Optional.of(updatedDTO);
    }

    public List<MovieDTO> getMoviesByStatus(String status) {
        List<Movie> movies = movieRepository.findByMovieStatus(status);
        return mapperRepository.movieToMovieDTOs(movies);
    }
    public String normalizeKeyword(String keyword) {
        if (keyword == null) return "";
        return keyword.trim().replaceAll("\\s+", " ");
    }

    public List<MovieDTO> searchMoviesByTitle(String keyword) {
        String normalizedKeyword = normalizeKeyword(keyword);
        List<Movie> movies = movieRepository.findByTitleContainingIgnoreCase(normalizedKeyword);
        return mapperRepository.movieToMovieDTOs(movies);
    }


//    public boolean deleteMovie(Long id) {
//        return movieRepository.findById(id).map(movie -> {
//            movieRepository.delete(movie);
//            return true;
//        }).orElse(false);
//    }
}
