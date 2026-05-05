package com.bonos.backend.config;

import com.bonos.backend.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 1. Aplicar la configuración de CORS definida en WebConfig
            .cors(withDefaults())

            // 2. Deshabilitar CSRF (común para APIs stateless)
            .csrf(csrf -> csrf.disable())

            // 3. Definir las reglas de autorización de las peticiones
            .authorizeHttpRequests(auth -> auth
                // 🔓 Endpoints públicos (no requieren autenticación)
                .requestMatchers("/api/v1/auth/**", "/api/v1/cetes/**").permitAll()

                // 🔐 Endpoints protegidos por rol
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/colab/**").hasRole("COLABORADOR")
                .requestMatchers("/api/v1/user/**").hasRole("USER")

                // 🔒 Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            )

            // 4. Añadir el filtro de JWT antes del filtro de autenticación estándar
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            // 5. Deshabilitar los mecanismos de login por formulario y HTTP Basic
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
