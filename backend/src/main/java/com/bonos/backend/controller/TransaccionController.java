package com.bonos.backend.controller;

import com.bonos.backend.dto.TransaccionResponse;
import com.bonos.backend.service.TransaccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Ajustar según seguridad en producción
public class TransaccionController {

    private final TransaccionService transaccionService;

    @GetMapping("{userId}")
    public ResponseEntity<List<TransaccionResponse>> getTransactionsByUserId(@PathVariable Long userId) {
        List<TransaccionResponse> response = transaccionService.getTransactionsByUserId(userId)
            .stream()
            .map(t -> new TransaccionResponse(
                t.getId(),
                t.getTipo(),
                t.getMonto(),
                t.getDescripcion(),
                t.getCreatedAt()
            )).toList();
        return ResponseEntity.ok(response);
    }
}