package com.bonos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cetes")
@Data
public class Cete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Column(nullable = false)
    private Integer plazo;

    @Column(name = "tasa_compra", nullable = false)
    private BigDecimal tasaCompra;

    @Column(name = "monto_invertido", nullable = false)
    private BigDecimal montoInvertido;

    @ManyToOne
    @JoinColumn(name = "portafolio_id", nullable = false)
    private Portafolio portafolio;
}