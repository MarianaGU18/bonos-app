package com.bonos.backend.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter implements Filter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI();

        // 🔓 rutas públicas
        if (path.startsWith("/api/v1/auth") || path.startsWith("/api/v1/cetes")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = req.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(request, response);
    }
}