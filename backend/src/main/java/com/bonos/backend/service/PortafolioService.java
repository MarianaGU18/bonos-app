package com.bonos.backend.service;

import com.bonos.backend.exception.ResourceNotFoundException;
import com.bonos.backend.model.Portafolio;
import com.bonos.backend.model.Transaccion;
import com.bonos.backend.model.TipoTransaccion;
import com.bonos.backend.model.User;
import com.bonos.backend.repository.PortafolioRepository;
import com.bonos.backend.repository.TransaccionRepository;
import com.bonos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PortafolioService {

    private final PortafolioRepository portafolioRepository;
    private final TransaccionRepository transaccionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Portafolio realizarDeposito(Long userId, double monto) {
        // 1. Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userId));

        // 2. Find the corresponding portfolio
        Portafolio portafolio = portafolioRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Portafolio no encontrado para el usuario con id: " + userId));

        // 3. Update cash balance in the portfolio
        BigDecimal montoDecimal = BigDecimal.valueOf(monto);
        portafolio.setCashBalance(portafolio.getCashBalance().add(montoDecimal));

        // 4. Create and save the transaction record using the correct constructor
        Transaccion transaccion = new Transaccion(user, TipoTransaccion.DEPOSITO, montoDecimal);
        transaccionRepository.save(transaccion);

        // 5. Save the updated portfolio and return it
        return portafolioRepository.save(portafolio);
    }

    public Portafolio findPortafolioByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userId));

        return portafolioRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Portafolio no encontrado para el usuario con id: " + userId));
    }
}
