package com.bonos.backend.dto;

public record LoginResponse(
        Long id,
        String name,
        String lastname,
        String maternallast,
        String message,
        String role,
        String email
) {
}
