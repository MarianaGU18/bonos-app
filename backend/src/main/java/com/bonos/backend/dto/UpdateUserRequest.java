package com.bonos.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserRequest {

    private String name;
    private String lastname;
    private String maternallast;
    private LocalDate birthdate;
}
