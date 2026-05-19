package com.bonos.backend.model;

import jakarta.persistence.*;
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
        if (tipo != TipoTransaccion.DEPOSITO && tipo != TipoTransaccion.RETIRO) {
            throw new IllegalArgumentException("This constructor is only for DEPOSITO or RETIRO.");
        }
        this.user = user;
        this.tipo = tipo;
        this.monto = monto;
    }

    // Constructor for Buy/Sell with description
    public Transaccion(User user, TipoTransaccion tipo, BigDecimal monto, String descripcion) {
        if (tipo != TipoTransaccion.COMPRA && tipo != TipoTransaccion.VENTA) {
            throw new IllegalArgumentException("This constructor is only for COMPRA or VENTA.");
        }
        this.user = user;
        this.tipo = tipo;
        this.monto = monto;
        this.descripcion = descripcion;
    }
}
