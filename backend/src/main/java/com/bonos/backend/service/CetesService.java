package com.bonos.backend.service;
import org.springframework.stereotype.Service;
import com.bonos.backend.dto.CetesResponse;

@Service
public class CetesService {

    private static final double VALOR_NOMINAL = 10.0;
    private static final double DIAS_AÑO_COMERCIAL = 360.0;

    private final BanxicoService banxicoService;

    public CetesService(BanxicoService banxicoService) {
        this.banxicoService = banxicoService;
    }   

    public CetesResponse obtenerCetes(int plazo) {

        double tasa = banxicoService.getCetes28dias() ;
        double precio = calcularPrecio(tasa, plazo);
        return new CetesResponse(
            VALOR_NOMINAL, tasa, plazo, precio);
    }

    public double calcularPrecio(double tasa, int plazo) {
        return VALOR_NOMINAL / (1 + (tasa * plazo / DIAS_AÑO_COMERCIAL));
    }

}