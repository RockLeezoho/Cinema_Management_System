package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "available_concession")
public class AvailableConcession {

    @EmbeddedId
    private AvailableConcessionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cinemaId")
    @JoinColumn(name = "cinemaid", nullable = false)
    private Cinema cinema;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("concessionId")
    @JoinColumn(name = "concessionid", nullable = false)
    private Concession concession;
}
