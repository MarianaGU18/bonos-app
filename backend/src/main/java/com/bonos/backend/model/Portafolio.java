package com.bonos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;

@Entity
@Table(name = "portafolio")
@Data
public class Portafolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "cash_balance")
    private BigDecimal cashBalance;

    @Column(name = "cetes_balance")
    private BigDecimal cetesBalance;

    @Column(name = "bonds_balance")
    private BigDecimal bondsBalance;

    @Column(name = "total_balance")
    private BigDecimal totalBalance;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private java.time.LocalDateTime createdAt;
}