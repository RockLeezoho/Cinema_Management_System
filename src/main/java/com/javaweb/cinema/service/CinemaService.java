package com.javaweb.cinema.service;

import com.javaweb.cinema.api.dto.MovieDTO;
import com.javaweb.cinema.persistence.entity.Cinema;
import com.javaweb.cinema.persistence.entity.Movie;
import com.javaweb.cinema.persistence.repository.CinemaRepository;
import com.javaweb.cinema.persistence.repository.MapperRepository;
import com.javaweb.cinema.persistence.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.javaweb.cinema.api.dto.CinemaDTO;

import java.util.Optional;

@Service
public class CinemaService {

    @Autowired
    private CinemaRepository cinemaRepository;

    @Autowired
    private MapperRepository mapperRepository;

    public Optional<CinemaDTO> findCinemaById(Long id) {
        return cinemaRepository.findById(id)
                .map(cinema -> mapperRepository.cinemaToCinemaDTO(cinema));
    }

    public Page<CinemaDTO> findCinemas(Pageable pageable) {
        Page<Cinema> cinemas = cinemaRepository.findAll(pageable);
        return cinemas.map(mapperRepository::cinemaToCinemaDTO);
    }

    public Cinema createCinema(CinemaDTO cinemaDTO) {
        Cinema cinema = new Cinema();

        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        cinema.setHotline(cinemaDTO.getHotline());
        cinema.setEmail(cinemaDTO.getEmail());
        cinema.setImage(cinemaDTO.getImage());

        return cinemaRepository.save(cinema);
    }

    public Optional<CinemaDTO> updateCinema(Long id, CinemaDTO cinemaDTO) {
        Optional<Cinema> optionalCinema = cinemaRepository.findById(id);
        if (optionalCinema.isEmpty()) {
            return Optional.empty();
        }

        Cinema cinema = optionalCinema.get();
        if (cinemaDTO.getImage() != null && !cinemaDTO.getImage().isEmpty()) {
            cinema.setImage(cinemaDTO.getImage());
        }

        cinema.setName(cinemaDTO.getName());
        cinema.setAddress(cinemaDTO.getAddress());
        cinema.setHotline(cinemaDTO.getHotline());
        cinema.setEmail(cinemaDTO.getEmail());
        cinema.setImage(cinemaDTO.getImage());

        Cinema saved = cinemaRepository.save(cinema);

        CinemaDTO updatedDTO = mapperRepository.cinemaToCinemaDTO(saved);
        return Optional.of(updatedDTO);
    }

//    @Transactional
//    public boolean deleteCinema(Long id) {
//        Optional<Cinema> optionalCinema = cinemaRepository.findById(id);
//        if (optionalCinema.isEmpty()) {
//            return false;
//        }
//        Cinema cinema = optionalCinema.get();
//
//        // Tach user ra khoi rap (dat cinema = null)
//        if (cinema.getUsers() != null) {
//            cinema.getUsers().forEach(user -> user.setCinema(null));
//        }
//
//        cinemaRepository.delete(cinema);
//        return true;
//    }

}
