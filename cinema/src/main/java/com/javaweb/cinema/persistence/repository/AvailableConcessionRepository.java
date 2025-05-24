package com.javaweb.cinema.persistence.repository;

import com.javaweb.cinema.api.dto.ConcessionDTO;
import com.javaweb.cinema.persistence.entity.AvailableConcession;
import com.javaweb.cinema.persistence.entity.AvailableConcessionId;
import com.javaweb.cinema.persistence.entity.Concession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvailableConcessionRepository extends JpaRepository<AvailableConcession, AvailableConcessionId> {

    void deleteByConcession(Concession concession); // xóa theo concession

    List<AvailableConcession> findByConcession(Concession concession); // nếu bạn cần truy xuất

    @Query("SELECT new com.javaweb.cinema.api.dto.ConcessionDTO(" +
            "c.id, c.image, c.name, c.type, c.sellingPrice, c.quantity, c.voucher.id) " +
            "FROM Concession c " +
            "JOIN AvailableConcession ac ON c.id = ac.concession.id " +
            "WHERE ac.id.cinemaId = :cinemaId")
    List<ConcessionDTO> findAvailableConcessionsByCinemaId(@Param("cinemaId") Long cinemaId);
}
