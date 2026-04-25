package com.bonos.backend.dto;

public class CetesResponse {
    private double vn;
    private double tasa;
    private int plazo;
    private double precio;

    public CetesResponse(double vn, double tasa, int plazo, double precio) {
        this.vn = vn;
        this.tasa = tasa;
        this.plazo = plazo;
        this.precio = precio;
    }

    public double getVn() { return vn; }
    public double getTasa() { return tasa; }
    public int getPlazo() { return plazo; }
    public double getPrecio() { return precio; }
}