package com.bonos.backend.controller;

import com.bonos.backend.dto.CeteSaleEstimateResponse;
import com.bonos.backend.service.CetesService;
import com.bonos.backend.repository.UserRepository;
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
        int plazo = Integer.parseInt(request.get("dias").toString());
        
        // Obtenemos la tasa actual del servicio para este plazo
        double tasa = cetesService.getCurrentRates()
                        .getOrDefault(plazo, java.math.BigDecimal.valueOf(6.54))
                        .doubleValue();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(cetesService.comprarCetes(user, monto, plazo, tasa));
    }

    @GetMapping("/tasas")
    public ResponseEntity<?> obtenerTasasActuales() {
        return ResponseEntity.ok(cetesService.getCurrentRates());
    }

    @PostMapping("/vender/{ceteId}")
    public ResponseEntity<?> venderCetes(@PathVariable Long ceteId, 
                                       @RequestParam(defaultValue = "false") boolean includeBonddia) {
        return ResponseEntity.ok(cetesService.venderCetes(ceteId, includeBonddia));
    }

    @GetMapping("/portafolio/{portfolioId}")
    public ResponseEntity<List<Cete>> obtenerInversiones(@PathVariable Long portfolioId) {
        return ResponseEntity.ok(cetesService.obtenerInversiones(portfolioId));
    }

    @GetMapping("/estimar-venta/{ceteId}")
    public ResponseEntity<CeteSaleEstimateResponse> estimarVentaCetes(@PathVariable Long ceteId) {
        CeteSaleEstimateResponse estimate = cetesService.estimarVentaCetes(ceteId);
        return ResponseEntity.ok(estimate);
    }
}