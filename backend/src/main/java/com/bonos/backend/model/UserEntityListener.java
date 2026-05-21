package com.bonos.backend.model;

import com.bonos.backend.service.PortafolioService;
import jakarta.persistence.PostPersist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

/**
 * Listener que intercepta la creación de un usuario para generar su portafolio automáticamente.
 */
@Component
public class UserEntityListener {

    private static PortafolioService portafolioService;

    @Autowired
    public void setPortafolioService(@Lazy PortafolioService portafolioService) {
        UserEntityListener.portafolioService = portafolioService;
    }

    @PostPersist
    public void afterUserPersist(User user) {
        if (portafolioService != null) {
            portafolioService.crearPortafolio(user);
        }
    }
}