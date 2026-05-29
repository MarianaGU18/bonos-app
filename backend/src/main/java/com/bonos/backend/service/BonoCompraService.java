package com.bonos.backend.service;

import com.bonos.backend.model.*;
import com.bonos.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BonoCompraService {

    private final PortafolioRepository portafolioRepository;
    private final BonoRepository bonoRepository;
    private final TransaccionService transaccionService;

    @Transactional
    public Portafolio comprarBono(User user, double valorNominal, double precioCompra,
                                   double precioTeorico, double tasaCuponAnual,
                                   double tasaDescuento, int plazoDias,
                                   String frecuenciaPago, double rendimiento) {

        Portafolio portafolio = portafolioRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Portfolio not found for user"));

        BigDecimal costo = BigDecimal.valueOf(precioCompra);

        if (portafolio.getCashBalance().compareTo(costo) < 0) {
            throw new RuntimeException("Insufficient funds in available cash");
        }

        portafolio.setCashBalance(portafolio.getCashBalance().subtract(costo));
        portafolio.setBondsBalance(portafolio.getBondsBalance().add(costo));
        portafolioRepository.save(portafolio);

        Bono bono = new Bono();
        bono.setPortafolio(portafolio);
        bono.setValorNominal(BigDecimal.valueOf(valorNominal));
        bono.setPrecioCompra(costo);
        bono.setPrecioTeorico(BigDecimal.valueOf(precioTeorico));
        bono.setTasaCuponAnual(BigDecimal.valueOf(tasaCuponAnual));
        bono.setTasaDescuento(BigDecimal.valueOf(tasaDescuento));
        bono.setPlazoDias(plazoDias);
        bono.setFrecuenciaPago(frecuenciaPago);
        bono.setRendimiento(BigDecimal.valueOf(rendimiento));
        bono.setFechaCompra(LocalDate.now());
        bono.setFechaVencimiento(LocalDate.now().plusDays(plazoDias));
        bonoRepository.save(bono);

        transaccionService.registrarTransaccion(user, TipoTransaccion.COMPRA, costo,
                String.format("Bono purchase - %.0f days (Rate: %.2f%%)", (double) plazoDias, tasaCuponAnual));

        return portafolio;
    }

    public List<Bono> obtenerBonos(Long userId) {
        Portafolio p = portafolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        return bonoRepository.findByPortafolioId(p.getId());
    }
}
