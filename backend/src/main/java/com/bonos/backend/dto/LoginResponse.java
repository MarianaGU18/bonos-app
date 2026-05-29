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
}
