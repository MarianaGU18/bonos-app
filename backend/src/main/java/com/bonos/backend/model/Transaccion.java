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

    @Column(name = "bono_id")
    private Long bonoId; // We'll map this properly later

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransaccion tipo;

    private Integer cantidad; // For buy/sell transactions

    private BigDecimal monto; // For deposit/withdrawal transactions

    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario; // For buy/sell transactions

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    // Constructor for Deposits/Withdrawals
    public Transaccion(User user, TipoTransaccion tipo, BigDecimal monto) {
        if (tipo != TipoTransaccion.DEPOSITO && tipo != TipoTransaccion.RETIRO) {
            throw new IllegalArgumentException("This constructor is for deposits and withdrawals only.");
        }
        this.user = user;
        this.tipo = tipo;
        this.monto = monto;
    }

}
