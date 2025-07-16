package com.javaweb.cinema.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "ticket", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"seatid", "showtimeid"})
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long ticketId;

    @Column(name = "paymentdate", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "paymentmethod", nullable = false)
    private String paymentMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tickettypeid", nullable = false)
    @ToString.Exclude
    private TicketType ticketType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seatid", nullable = false)
    @ToString.Exclude
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtimeid", nullable = false)
    @ToString.Exclude
    private Showtime showtime;
}
