package com.bonos.backend.controller;

import com.bonos.backend.dto.CeteSaleEstimateResponse;
import com.bonos.backend.model.*;
import com.bonos.backend.repository.UserRepository;
import com.bonos.backend.service.BonoCompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/bonos-activos")
@RequiredArgsConstructor
public class BonoCompraController {

    private final BonoCompraService bonoCompraService;
    private final UserRepository userRepository;

    @PostMapping("/comprar")
    public ResponseEntity<?> comprarBono(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        double valorNominal = Double.parseDouble(request.get("valorNominal").toString());
        double precioCompra = Double.parseDouble(request.get("precioCompra").toString());
        double precioTeorico = Double.parseDouble(request.get("precioTeorico").toString());
        double tasaCuponAnual = Double.parseDouble(request.get("tasaCuponAnual").toString());
        double tasaDescuento = Double.parseDouble(request.get("tasaDescuento").toString());
        int plazoDias = Integer.parseInt(request.get("plazoDias").toString());
        String frecuenciaPago = request.get("frecuenciaPago").toString();
        double rendimiento = Double.parseDouble(request.get("rendimiento").toString());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(bonoCompraService.comprarBono(user, valorNominal, precioCompra,
                precioTeorico, tasaCuponAnual, tasaDescuento, plazoDias, frecuenciaPago, rendimiento));
    }

    @GetMapping("/portafolio/{userId}")
    public ResponseEntity<List<Bono>> obtenerBonos(@PathVariable Long userId) {
        return ResponseEntity.ok(bonoCompraService.obtenerBonos(userId));
    }

    @GetMapping("/estimar-venta/{bonoId}")
    public ResponseEntity<CeteSaleEstimateResponse> estimarVentaBono(@PathVariable Long bonoId) {
        return ResponseEntity.ok(bonoCompraService.estimarVentaBono(bonoId));
    }

    @PostMapping("/vender/{bonoId}")
    public ResponseEntity<?> venderBono(@PathVariable Long bonoId) {
        return ResponseEntity.ok(bonoCompraService.venderBono(bonoId));
    }
}
