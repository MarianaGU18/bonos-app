package com.bonos.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CeteSaleEstimateResponse {
    private BigDecimal estimatedSaleAmount;
    private BigDecimal estimatedProfit;
}