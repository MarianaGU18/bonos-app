package com.bonos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bonos_activos")
@Data
public class Bono {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "portafolio_id", nullable = false)
    private Portafolio portafolio;

    @Column(nullable = false)
    private BigDecimal valorNominal;

    @Column(nullable = false)
    private BigDecimal precioCompra;

    @Column(nullable = false)
    private BigDecimal precioTeorico;

    @Column(nullable = false)
    private BigDecimal tasaCuponAnual;

    @Column(nullable = false)
    private BigDecimal tasaDescuento;

    @Column(nullable = false)
    private Integer plazoDias;

    @Column(nullable = false)
    private String frecuenciaPago;

    @Column(nullable = false)
    private BigDecimal rendimiento;

    @Column(nullable = false)
    private LocalDate fechaCompra;

    @Column(nullable = false)
    private LocalDate fechaVencimiento;
}
