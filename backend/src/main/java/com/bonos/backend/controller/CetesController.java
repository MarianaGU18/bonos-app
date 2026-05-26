package com.bonos.backend.controller;

import com.bonos.backend.dto.CeteSaleEstimateResponse;
import com.bonos.backend.service.CetesService;
import com.bonos.backend.repository.UserRepository;
import com.bonos.backend.dto.CetesResponse;
import com.bonos.backend.model.Portafolio;
import com.bonos.backend.model.Cete;
import com.bonos.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/api/v1/cetes")
public class CetesController {

    private final CetesService cetesService;
    private final UserRepository userRepository;

    public CetesController(CetesService cetesService, UserRepository userRepository) {
        this.cetesService = cetesService;
        this.userRepository = userRepository;
    }

    @PostMapping("/comprar")
    public ResponseEntity<?> comprarCetes(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        double monto = Double.parseDouble(request.get("monto").toString());
        int plazo = Integer.parseInt(request.get("plazo").toString());
        
        // Usamos la tasa enviada por el frontend (calculadora) o la del mercado si no viene
        double tasa = request.containsKey("tasa") ? Double.parseDouble(request.get("tasa").toString()) : 0;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(cetesService.comprarCetes(user, monto, plazo, tasa));
    }

    @GetMapping("/rates")
    public ResponseEntity<?> obtenerTasasActuales() {
        return ResponseEntity.ok(cetesService.getCurrentRates());
    }

    @GetMapping("/calcular")
    public ResponseEntity<CetesResponse> calcularInversion(
            @RequestParam double monto,
            @RequestParam int plazo,
            @RequestParam double tasa) {
        return ResponseEntity.ok(cetesService.calcularInversion(monto, plazo, tasa));
    }

    @PostMapping("/vender/{ceteId}")
    public ResponseEntity<?> venderCetes(@PathVariable Long ceteId) {
        return ResponseEntity.ok(cetesService.venderCetes(ceteId));
    }

    @GetMapping("/portafolio/{userId}")
    public ResponseEntity<List<Cete>> obtenerInversiones(@PathVariable Long userId) {
        return ResponseEntity.ok(cetesService.obtenerInversiones(userId));
    }

    @GetMapping("/estimar-venta/{ceteId}")
    public ResponseEntity<CeteSaleEstimateResponse> estimarVentaCetes(@PathVariable Long ceteId) {
        CeteSaleEstimateResponse estimate = cetesService.estimarVentaCetes(ceteId);
        return ResponseEntity.ok(estimate);
    }
}