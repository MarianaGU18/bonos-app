package com.bonos.backend.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CetesResponse {
    private BigDecimal montoInicial;
    private int plazo;
    private BigDecimal totalFinal;
    private int titulosCetes;
    private BigDecimal tasaCetes;
    private BigDecimal inversionCetes;
    private BigDecimal interesCetes;
    private BigDecimal remanente;
    private BigDecimal isr;
}