package com.bonos.backend.controller;

import com.bonos.backend.dto.DepositoRequest;
import com.bonos.backend.model.Portafolio;
import com.bonos.backend.model.Transaccion;
import com.bonos.backend.service.PortafolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/api/v1/portafolio")
@RequiredArgsConstructor
public class PortafolioController {

    private final PortafolioService portafolioService;

    @PostMapping("/deposito/{userId}")
    public ResponseEntity<Portafolio> realizarDeposito(
            @PathVariable Long userId,
            @RequestBody DepositoRequest depositoRequest
    ) {
        Portafolio portafolioActualizado = portafolioService.realizarDeposito(userId, depositoRequest.getMonto());
        return ResponseEntity.ok(portafolioActualizado);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Portafolio> obtenerPortafolio(@PathVariable Long userId) {
        // Corrected method call from obtenerPortafolioPorId to findPortafolioByUserId
        Portafolio portafolio = portafolioService.findPortafolioByUserId(userId);
        return ResponseEntity.ok(portafolio);
    }

    @GetMapping("/transacciones/{userId}")
    public ResponseEntity<List<Transaccion>> obtenerTransacciones(@PathVariable Long userId) {
        List<Transaccion> transacciones = portafolioService.obtenerTransaccionesPorUsuario(userId);
        return ResponseEntity.ok(transacciones);
    }

}
