package com.bonos.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class BanxicoService {

    // =========================
    // CONFIG
    // =========================

    @Value("${banxico.token}")
    private String token;

    private static final String BASE_URL =
            "https://www.banxico.org.mx/SieAPIRest/service/v1/series/";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // =========================
    // SERIES OFICIALES
    // =========================

    private static final String CETES_28 = "SF60633";
    private static final String CETES_91 = "SF60634";
    private static final String CETES_182 = "SF60635";
    private static final String CETES_364 = "SF60636";

    // =========================
    // ENDPOINTS PÚBLICOS
    // =========================

    public double getCetes28dias() {
        return obtenerTasa(CETES_28);
    }

    public double getCetes91dias() {
        return obtenerTasa(CETES_91);
    }

    public double getCetes182dias() {
        return obtenerTasa(CETES_182);
    }

    public double getCetes364dias() {
        return obtenerTasa(CETES_364);
    }

    // =========================
    // CORE REQUEST
    // =========================

    private double obtenerTasa(String serie) {

        String url = BASE_URL + serie + "/datos/oportuno";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Bmx-Token", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        String.class
                );

        return parseRate(response.getBody());
    }

    // =========================
    // PARSER JSON BANXICO
    // =========================

    private double parseRate(String json) {

        try {
            JsonNode root = mapper.readTree(json);

            String valor = root
                    .path("bmx")
                    .path("series")
                    .get(0)
                    .path("datos")
                    .get(0)
                    .path("dato")
                    .asText();

            return Double.parseDouble(valor);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error reading Banxico response"
            );
        }
    }
}