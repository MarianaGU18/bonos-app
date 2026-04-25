package com.bonos.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.bonos.backend.service.BanxicoService;
import com.bonos.backend.service.CetesService;
import com.bonos.backend.dto.CetesResponse;


@RestController
@RequestMapping("/api/v1/cetes")
@CrossOrigin(origins = "*")

public class CetesController {

    @Autowired
    private BanxicoService banxicoService;

    @Autowired
    private CetesService cetesService;
    private static final double VALOR_NOMINAL = 10.0;

    @GetMapping("/precio")
    public CetesResponse getPrecioCete(@RequestParam int dias) {
        
        // Obtener tasa desde Banxico y calcular precio del Cete a 28 días
        double tasa;
        switch (dias) {
            case 28:
                tasa = banxicoService.getCetes28dias();
                break;
            /*case 91:
                tasa = banxicoService.getCetes91dias();
                break;
            case 182:
                tasa = banxicoService.getCetes182dias() ;
                break;
            case 364:
                tasa = banxicoService.getCetes364dias();
                break;*/
            default:
                throw new IllegalArgumentException(
                    "Días no válidos. Solo se permiten: 28, 91, 182, 364.");
        }

        // convertir SOLO una vez a decimal
        //double tasaDecimal = tasa / 100;

        double precio = cetesService.calcularPrecio(tasa, dias);

        return new CetesResponse(
        VALOR_NOMINAL, 
        tasa, 
        dias, 
        precio);
    }
}