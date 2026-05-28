package com.bonos.backend.controller;

import com.bonos.backend.dto.BonoCalculoResponse;
import com.bonos.backend.service.BonoCalculoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bonos")
public class BonoCalculoController {

    private final BonoCalculoService bonoCalculoService;

    public BonoCalculoController(BonoCalculoService bonoCalculoService) {
        this.bonoCalculoService = bonoCalculoService;
    }

    @GetMapping("/calcular")
    public ResponseEntity<BonoCalculoResponse> calcular(
            @RequestParam double valorNominal,
            @RequestParam double tasaCuponAnual,
            @RequestParam double tasaDescuento,
            @RequestParam int plazoDias,
            @RequestParam String frecuenciaPago,
            @RequestParam double precioCompra) {

        return ResponseEntity.ok(bonoCalculoService.calcular(
                valorNominal, tasaCuponAnual, tasaDescuento,
                plazoDias, frecuenciaPago, precioCompra));
    }
}
