package com.bonos.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cetes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portafolio_id", nullable = false)
    @JsonIgnore
    private Portafolio portafolio;

    @Column(nullable = false)
    private int titulos;

    @Column(name = "valor_adquisicion", nullable = false, precision = 19, scale = 4)
    private BigDecimal valorAdquisicion;

    @Column(name = "tasa_compra", nullable = false, precision = 10, scale = 4)
    private BigDecimal tasaCompra;

    @Column(name = "fecha_compra", nullable = false)
    private LocalDate fechaCompra;

    @Column(nullable = false)
    private int plazo;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;
}
