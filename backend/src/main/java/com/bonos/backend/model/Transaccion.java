package com.bonos.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones")
@Data
@NoArgsConstructor
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransaccion tipo;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column
    private String descripcion;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    // Constructor for Deposits/Withdrawals
    public Transaccion(User user, TipoTransaccion tipo, BigDecimal monto) {
        this.user = user;
        this.tipo = tipo;
        this.monto = monto;
    }

    // Constructor with description (Used for all types)
    public Transaccion(User user, TipoTransaccion tipo, BigDecimal monto, String descripcion) {
        this.user = user;
        this.tipo = tipo;
        this.monto = monto;
        this.descripcion = descripcion;
    }
}
