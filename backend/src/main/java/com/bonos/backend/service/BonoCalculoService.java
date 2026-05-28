package com.bonos.backend.service;

import com.bonos.backend.dto.BonoCalculoResponse;
import org.springframework.stereotype.Service;

@Service
public class BonoCalculoService {

    public BonoCalculoResponse calcular(
            double valorNominal,
            double tasaCuponAnual,
            double tasaDescuento,
            int plazoDias,
            String frecuenciaPago,
            double precioCompra) {

        int frecuencia = getFrecuencia(frecuenciaPago);

        double cuponPorPeriodo = valorNominal * (tasaCuponAnual / 100.0) / frecuencia;
        int numPeriodos = (int) Math.round((plazoDias / 360.0) * frecuencia);
        double tasaPorPeriodo = (tasaDescuento / 100.0) / frecuencia;

        double vpCupones = 0;
        for (int t = 1; t <= numPeriodos; t++) {
            vpCupones += cuponPorPeriodo / Math.pow(1 + tasaPorPeriodo, t);
        }

        double vpValorNominal = valorNominal / Math.pow(1 + tasaPorPeriodo, numPeriodos);
        double precioTeorico = vpCupones + vpValorNominal;
        double rendimiento = precioCompra > 0
                ? (precioTeorico - precioCompra) / precioCompra * 100
                : 0;

        BonoCalculoResponse res = new BonoCalculoResponse();
        res.setValorNominal(valorNominal);
        res.setTasaCuponAnual(tasaCuponAnual);
        res.setTasaDescuento(tasaDescuento);
        res.setPlazoDias(plazoDias);
        res.setFrecuenciaPago(frecuenciaPago);
        res.setPrecioCompra(precioCompra);
        res.setCuponPorPeriodo(cuponPorPeriodo);
        res.setNumPeriodos(numPeriodos);
        res.setVpCupones(vpCupones);
        res.setVpValorNominal(vpValorNominal);
        res.setPrecioTeorico(precioTeorico);
        res.setRendimiento(rendimiento);
        return res;
    }

    private int getFrecuencia(String frecuenciaPago) {
        return switch (frecuenciaPago.toUpperCase()) {
            case "MENSUAL" -> 12;
            case "TRIMESTRAL" -> 4;
            case "SEMESTRAL" -> 2;
            default -> 1;
        };
    }
}
