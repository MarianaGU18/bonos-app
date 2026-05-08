package com.bonos.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CetesResponse {

    private BigDecimal montoInvertido;
    private int plazo;
    private BigDecimal totalFinal;

    private int titulosCetes;
    private BigDecimal tasaCetes;
    private BigDecimal inversionCetes;
    private BigDecimal interesBrutoCetes;

    private BigDecimal remanente;

    private int titulosBonddia;
    private BigDecimal tasaBonddia;
    private BigDecimal inversionBonddia;
    private BigDecimal interesBonddia;

    private BigDecimal isr;
}