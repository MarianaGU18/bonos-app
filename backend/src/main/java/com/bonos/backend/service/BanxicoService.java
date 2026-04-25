package com.bonos.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service

public class BanxicoService {
    
    @Value("${banxico.token}")

    private String token;
    private final String URL = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF60633/datos/oportuno";

    // Obtener la tasa de los CETES a 28 días desde Banxico
    public double getCetes28dias(){

        // Cliente HTTP
        RestTemplate restTemplate = new RestTemplate();
        // Headers de la peticion
        HttpHeaders headers = new HttpHeaders();
        // Agregar el token requerido por Banxico
        headers.set("Bmx-Token", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Get de la Api de Banxico
        ResponseEntity<String> response = restTemplate.exchange(
            URL, 
            HttpMethod.GET, 
            entity, 
            String.class
        );
        
        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Cuerpo recibido: " + response.getBody());
        return parseRate(response.getBody());
    }

    //  Extraer la tasa desde la respuesta JSON de Banxico
    private double parseRate(String json) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
            String valor = root
                .path("bmx")
                .path("series").get(0)
                .path("datos").get(0)
                .path("dato")
                .asText();
            return Double.parseDouble(valor);

        } catch (Exception e){
            throw new RuntimeException("No se encontraron datos válidos en la respuesta de Banxico.");
          
        }

    }
}