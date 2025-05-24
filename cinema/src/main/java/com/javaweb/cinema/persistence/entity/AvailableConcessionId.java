package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvailableConcessionId implements Serializable {

    private Long cinemaId;
    private Long concessionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AvailableConcessionId)) return false;
        AvailableConcessionId that = (AvailableConcessionId) o;
        return Objects.equals(cinemaId, that.cinemaId) &&
                Objects.equals(concessionId, that.concessionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cinemaId, concessionId);
    }
}
