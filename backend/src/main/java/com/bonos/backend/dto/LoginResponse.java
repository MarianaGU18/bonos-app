package com.bonos.backend.dto;

import java.time.LocalDate;

public record LoginResponse(
        Long id,
        String name,
        String lastname,
        String maternallast,
        String message,
        String role,
        String email,
        LocalDate birthdate
) {
    /**
     * Constructor de compatibilidad para llamadas con 7 parámetros.
     * Útil para respuestas de error donde la fecha no es necesaria.
     */
    public LoginResponse(Long id, String name, String lastname, String maternallast, String message, String role, String email) {
        this(id, name, lastname, maternallast, message, role, email, null);
    }
}
