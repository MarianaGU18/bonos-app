package com.bonos.backend.dto;

import lombok.Data;

@Data
public class BonoCalculoResponse {
    private double valorNominal;
    private double tasaCuponAnual;
    private double tasaDescuento;
    private int plazoDias;
    private String frecuenciaPago;
    private double precioCompra;
    private double cuponPorPeriodo;
    private int numPeriodos;
    private double vpCupones;
    private double vpValorNominal;
    private double precioTeorico;
    private double rendimiento;
}
