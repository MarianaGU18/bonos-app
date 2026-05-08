package com.bonos.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bonos.backend.dto.CetesResponse;
import com.bonos.backend.service.BanxicoService;
import com.bonos.backend.service.CetesService;

@RestController
@RequestMapping("/api/v1/cetes")
@CrossOrigin(origins = "*")
public class CetesController {

    @Autowired
    private CetesService cetesService;

    @Autowired
    private BanxicoService banxicoService;

    @GetMapping("/calcular")
    public CetesResponse calcularInversion(
            @RequestParam double monto,
            @RequestParam int dias) {

        if(monto <100 || monto > 10_000_000){
            throw new IllegalArgumentException(
                "El monto debe ser entre 100 y 10,000,,000"
            );
        }

        double tasa = obtenerTasa(dias);

        return cetesService.calcularInversion(
                monto,
                dias,
                tasa
        );
    }

    // =========================
    // MAPEO OFICIAL CETES
    // =========================

    private double obtenerTasa(int dias) {

        return switch (dias) {

            case 28 -> banxicoService.getCetes28dias();

            case 91 -> banxicoService.getCetes91dias();

            case 182 -> banxicoService.getCetes182dias();

            case 364 -> banxicoService.getCetes364dias();

            default -> throw new IllegalArgumentException(
                    "Días no válidos. Solo: 28, 91, 182, 364"
            );
        };
    }
}